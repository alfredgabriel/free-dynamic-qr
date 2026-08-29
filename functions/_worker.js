/**
 * free-dynamic-qr — Cloudflare Pages Worker
 * Handles: QR redirects, Admin API, First-time setup
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // QR Redirect: /r/<slug>
  if (path.startsWith("/r/")) {
    const slug = path.slice(3).replace(/\/$/, "");
    if (!slug) return Response.redirect(url.origin, 302);

    const data = await env.QR_KV.get(`qr:${slug}`, "json");
    if (!data || !data.url) {
      return new Response("QR code not found.", { status: 404 });
    }

    // Track scan count
    try {
      const updated = { ...data, scans: (data.scans || 0) + 1, lastScan: new Date().toISOString() };
      await env.QR_KV.put(`qr:${slug}`, JSON.stringify(updated));
    } catch (_) {}

    return Response.redirect(data.url, 302);
  }

  // API routes
  if (path.startsWith("/api/")) {
    return handleAPI(request, env, path, corsHeaders);
  }

  return env.ASSETS.fetch(request);
}

async function handleAPI(request, env, path, corsHeaders) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // POST /api/setup
  if (path === "/api/setup" && request.method === "POST") {
    const existing = await env.QR_KV.get("config:password");
    if (existing) return json({ error: "Already configured." }, 403);
    const { password } = await request.json();
    if (!password || password.length < 6)
      return json({ error: "Password must be at least 6 characters." }, 400);
    const hash = await hashPassword(password);
    await env.QR_KV.put("config:password", hash);
    return json({ ok: true });
  }

  // POST /api/login
  if (path === "/api/login" && request.method === "POST") {
    const { password } = await request.json();
    const storedHash = await env.QR_KV.get("config:password");
    if (!storedHash) return json({ error: "Not set up yet." }, 400);
    const isValid = await verifyPassword(password, storedHash);
    if (!isValid) return json({ error: "Incorrect password." }, 401);
    const token = await createToken(storedHash);
    return json({ token });
  }

  // All routes below require auth
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const storedHash = await env.QR_KV.get("config:password");
  if (!storedHash || !token || !(await verifyToken(token, storedHash))) {
    return json({ error: "Unauthorized." }, 401);
  }

  // GET /api/qrs
  if (path === "/api/qrs" && request.method === "GET") {
    const list = await env.QR_KV.list({ prefix: "qr:" });
    const qrs = await Promise.all(
      list.keys.map(async (k) => {
        const data = await env.QR_KV.get(k.name, "json");
        return { slug: k.name.replace("qr:", ""), ...data };
      })
    );
    return json(qrs.filter(Boolean));
  }

  // POST /api/qrs
  if (path === "/api/qrs" && request.method === "POST") {
    const { slug, url, label } = await request.json();
    if (!slug || !url) return json({ error: "slug and url are required." }, 400);
    const clean = slug.toLowerCase().replace(/[^a-z0-9\-_]/g, "");
    if (!clean) return json({ error: "Invalid slug." }, 400);
    const existing = await env.QR_KV.get(`qr:${clean}`);
    if (existing) return json({ error: "Slug already in use." }, 409);
    const entry = { url, label: label || clean, scans: 0, createdAt: new Date().toISOString(), lastScan: null };
    await env.QR_KV.put(`qr:${clean}`, JSON.stringify(entry));
    return json({ slug: clean, ...entry }, 201);
  }

  // PUT /api/qrs/:slug
  if (path.startsWith("/api/qrs/") && request.method === "PUT") {
    const slug = path.slice(9);
    const data = await env.QR_KV.get(`qr:${slug}`, "json");
    if (!data) return json({ error: "QR not found." }, 404);
    const { url, label } = await request.json();
    const updated = { ...data, ...(url && { url }), ...(label && { label }), updatedAt: new Date().toISOString() };
    await env.QR_KV.put(`qr:${slug}`, JSON.stringify(updated));
    return json({ slug, ...updated });
  }

  // DELETE /api/qrs/:slug
  if (path.startsWith("/api/qrs/") && request.method === "DELETE") {
    const slug = path.slice(9);
    await env.QR_KV.delete(`qr:${slug}`);
    return json({ ok: true });
  }

  return json({ error: "Not found." }, 404);
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  try {
    const [saltHex, hashHex] = stored.split(":");
    const salt = new Uint8Array(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)));
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
    const testHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return testHex === hashHex;
  } catch {
    return false;
  }
}

async function createToken(hashRef) {
  const payload = `${Date.now()}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(hashRef.slice(0, 32)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const sigHex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payload}.${sigHex}`;
}

async function verifyToken(token, hashRef) {
  try {
    const [payload, sigHex] = token.split(".");
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(hashRef.slice(0, 32)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const testHex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return testHex === sigHex;
  } catch {
    return false;
  }
}
