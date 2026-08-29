const fs = require("fs");

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Free Dynamic QR</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\/script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a0a0f;--bg2:#111118;--bg3:#1a1a25;--border:#2a2a3a;--accent:#7c6bff;--accent2:#a78bfa;--glow:rgba(124,107,255,.2);--green:#22d3a3;--red:#f87171;--text:#e8e8f0;--text2:#9090a8;--card:rgba(26,26,37,.85)}
html,body{height:100%}
body{font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
body::before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(124,107,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,107,255,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
#app{position:relative;z-index:1;min-height:100vh}
.auth-screen{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
.auth-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:48px 40px;width:100%;max-width:420px;backdrop-filter:blur(20px);box-shadow:0 0 60px rgba(124,107,255,.1),0 25px 50px rgba(0,0,0,.5)}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.logo-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff}
.logo-name{font-size:20px;font-weight:700}.logo-sub{font-size:12px;color:var(--text2)}
.auth-title{font-size:26px;font-weight:700;margin-bottom:8px}
.auth-sub{color:var(--text2);font-size:14px;margin-bottom:32px;line-height:1.6}
label{display:block;font-size:13px;font-weight:500;color:var(--text2);margin-bottom:8px}
input[type=text],input[type=url],input[type=password]{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 16px;color:var(--text);font-size:15px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--glow)}
.field{margin-bottom:16px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px 24px;border:none;border-radius:10px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .2s;margin-top:4px}
.btn-primary{background:linear-gradient(135deg,var(--accent),#6d5ce7);color:#fff;box-shadow:0 4px 20px var(--glow)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px var(--glow)}
.btn-danger{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.3);margin-top:0}
.btn-ghost{background:var(--bg3);color:var(--text2);border:1px solid var(--border);margin-top:0}
.btn-ghost:hover{border-color:var(--accent);color:var(--text)}
.btn-sm{width:auto;padding:8px 14px;font-size:13px;border-radius:8px}
.err{color:var(--red);font-size:13px;margin-top:8px;display:none}.err.show{display:block}
.hidden{display:none!important}
header{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid var(--border);background:rgba(10,10,15,.9);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
.h-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px}
.h-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff}
.h-right{display:flex;align-items:center;gap:12px}
.badge{background:rgba(124,107,255,.12);border:1px solid rgba(124,107,255,.25);color:var(--accent2);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:500}
main{padding:32px;max-width:1100px;margin:0 auto}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:32px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;backdrop-filter:blur(10px)}
.stat-label{font-size:12px;color:var(--text2);font-weight:500;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.stat-value{font-size:30px;font-weight:800;background:linear-gradient(135deg,var(--text),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.section{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px;backdrop-filter:blur(10px);margin-bottom:28px}
.section-title{font-size:16px;font-weight:700;margin-bottom:20px}
.create-form{display:grid;grid-template-columns:1fr 2fr 1fr auto;gap:12px;align-items:end}
@media(max-width:768px){.create-form{grid-template-columns:1fr}main{padding:16px}header{padding:16px}}
.qr-list{display:flex;flex-direction:column;gap:14px}
.qr-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;display:grid;grid-template-columns:auto 1fr auto auto;gap:20px;align-items:center;transition:border-color .2s,transform .2s;animation:fadeIn .3s ease}
.qr-card:hover{border-color:rgba(124,107,255,.3);transform:translateY(-1px)}
.qr-thumb{width:78px;height:78px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:6px;flex-shrink:0}
.qr-label{font-weight:600;font-size:16px;margin-bottom:4px}
.qr-slug{font-size:12px;color:var(--accent2);background:rgba(124,107,255,.1);border:1px solid rgba(124,107,255,.2);padding:2px 8px;border-radius:6px;display:inline-block;margin-bottom:8px;cursor:pointer}
.qr-url{font-size:13px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:380px}
.qr-scans{text-align:center;flex-shrink:0}.qr-scans-num{font-size:26px;font-weight:800;color:var(--green)}.qr-scans-label{font-size:11px;color:var(--text2)}
.qr-actions{display:flex;flex-direction:column;gap:7px;flex-shrink:0}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:24px;opacity:0;pointer-events:none;transition:opacity .2s}
.modal-overlay.open{opacity:1;pointer-events:all}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:32px;width:100%;max-width:500px;box-shadow:0 25px 60px rgba(0,0,0,.6);transform:scale(.95);transition:transform .2s}
.modal-overlay.open .modal{transform:scale(1)}
.modal-title{font-size:20px;font-weight:700;margin-bottom:6px}
.modal-sub{color:var(--text2);font-size:14px;margin-bottom:22px}
.modal-actions{display:flex;gap:10px;margin-top:20px}
.qr-preview{display:flex;justify-content:center;margin:20px 0;background:#fff;border-radius:12px;padding:16px}
.empty{text-align:center;padding:56px 24px;color:var(--text2)}
.empty-title{font-size:19px;font-weight:600;color:var(--text);margin-bottom:8px}
.toast{position:fixed;bottom:24px;right:24px;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:13px 20px;font-size:14px;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,.4);transform:translateY(100px);opacity:0;transition:all .3s;z-index:2000}
.toast.show{transform:translateY(0);opacity:1}
.toast.success{border-color:rgba(34,211,163,.4);color:var(--green)}.toast.error{border-color:rgba(248,113,113,.4);color:var(--red)}
.spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:none}
.btn.loading .spin{display:block}.btn.loading .btn-text{display:none}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div id="app">
<div id="s-setup" class="auth-screen">
  <div class="auth-card">
    <div class="logo"><div class="logo-icon">QR</div><div><div class="logo-name">Free Dynamic QR</div><div class="logo-sub">autoalojado en Cloudflare</div></div></div>
    <h1 class="auth-title">Bienvenido!</h1>
    <p class="auth-sub">Primera vez aqui. Crea una contrasena para proteger tu panel.</p>
    <div class="field"><label>Contrasena (min. 6 caracteres)</label><input id="s-pw" type="password" placeholder="Tu contrasena..."/></div>
    <div class="field"><label>Confirmar contrasena</label><input id="s-pw2" type="password" placeholder="Repite..."/></div>
    <button id="s-btn" class="btn btn-primary"><div class="spin"></div><span class="btn-text">Crear y entrar</span></button>
    <div id="s-err" class="err"></div>
  </div>
</div>
<div id="s-login" class="auth-screen hidden">
  <div class="auth-card">
    <div class="logo"><div class="logo-icon">QR</div><div><div class="logo-name">Free Dynamic QR</div><div class="logo-sub">autoalojado en Cloudflare</div></div></div>
    <h1 class="auth-title">Acceder al panel</h1>
    <p class="auth-sub">Introduce tu contrasena para gestionar tus QRs.</p>
    <div class="field"><label>Contrasena</label><input id="l-pw" type="password" placeholder="Tu contrasena..."/></div>
    <button id="l-btn" class="btn btn-primary"><div class="spin"></div><span class="btn-text">Entrar</span></button>
    <div id="l-err" class="err"></div>
  </div>
</div>
<div id="s-panel" class="hidden">
  <header>
    <div class="h-logo"><div class="h-icon">QR</div>Free Dynamic QR</div>
    <div class="h-right"><span class="badge">Cloudflare Free</span><button id="btn-logout" class="btn btn-ghost btn-sm">Salir</button></div>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><div class="stat-label">Total QRs</div><div class="stat-value" id="st-total">0</div></div>
      <div class="stat"><div class="stat-label">Escaneos totales</div><div class="stat-value" id="st-scans">0</div></div>
      <div class="stat"><div class="stat-label">Ultimo escaneo</div><div class="stat-value" id="st-last" style="font-size:17px;margin-top:6px">-</div></div>
    </div>
    <div class="section">
      <div class="section-title">+ Crear nuevo QR</div>
      <div class="create-form">
        <div class="field" style="margin:0"><label>Slug</label><input id="n-slug" type="text" placeholder="ej: portfolio"/></div>
        <div class="field" style="margin:0"><label>URL de destino</label><input id="n-url" type="url" placeholder="https://ejemplo.com"/></div>
        <div class="field" style="margin:0"><label>Nombre (opcional)</label><input id="n-label" type="text" placeholder="Mi portfolio"/></div>
        <button id="c-btn" class="btn btn-primary btn-sm" style="height:48px;align-self:end"><div class="spin"></div><span class="btn-text">Crear QR</span></button>
      </div>
    </div>
    <div class="section-title" style="margin-bottom:16px">Mis codigos QR</div>
    <div id="qr-list" class="qr-list"></div>
  </main>
</div>
<div id="m-edit" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">Editar QR</div>
    <div class="modal-sub" id="m-edit-slug"></div>
    <div class="field"><label>Nueva URL de destino</label><input id="e-url" type="url" placeholder="https://..."/></div>
    <div class="field"><label>Nombre</label><input id="e-label" type="text" placeholder="Nombre del QR"/></div>
    <div class="modal-actions">
      <button class="btn btn-primary" id="e-btn"><div class="spin"></div><span class="btn-text">Guardar</span></button>
      <button class="btn btn-ghost" id="e-cancel">Cancelar</button>
    </div>
  </div>
</div>
<div id="m-qr" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">Tu codigo QR</div>
    <div class="modal-sub" id="m-qr-url"></div>
    <div class="qr-preview"><canvas id="m-qr-canvas"></canvas></div>
    <div class="modal-actions">
      <button class="btn btn-primary" id="m-qr-dl">Descargar PNG</button>
      <button class="btn btn-ghost" id="m-qr-close">Cerrar</button>
    </div>
  </div>
</div>
<div id="m-del" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">Eliminar QR</div>
    <div class="modal-sub" id="m-del-msg"></div>
    <div class="modal-actions">
      <button class="btn btn-danger" id="d-btn"><div class="spin"></div><span class="btn-text">Si, eliminar</span></button>
      <button class="btn btn-ghost" id="d-cancel">Cancelar</button>
    </div>
  </div>
</div>
<div id="toast" class="toast"></div>
</div>
<script>
var _tok = sessionStorage.getItem("qr_t") || "";
var _editSlug = "";
var _delSlug = "";

function show(id) {
  ["s-setup","s-login","s-panel"].forEach(function(s) {
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}
function setLoad(id, on) {
  var b = document.getElementById(id);
  if (!b) return;
  on ? b.classList.add("loading") : b.classList.remove("loading");
}
function showErr(id, msg) {
  var e = document.getElementById(id);
  if (!e) return;
  e.textContent = msg; e.classList.add("show");
}
function hideErr(id) {
  var e = document.getElementById(id);
  if (e) e.classList.remove("show");
}
function esc(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
var _tt;
function toast(msg, type) {
  var t = document.getElementById("toast");
  t.textContent = (type === "success" ? "+ " : "x ") + msg;
  t.className = "toast " + (type || "success") + " show";
  clearTimeout(_tt);
  _tt = setTimeout(function() { t.classList.remove("show"); }, 3000);
}
function openM(id) { document.getElementById(id).classList.add("open"); }
function closeM(id) { document.getElementById(id).classList.remove("open"); }

async function init() {
  try {
    var r = await fetch("/api/setup", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({__check:true}) });
    var d = await r.json();
    if (d.notSetup) { show("s-setup"); return; }
    if (_tok) {
      var t = await fetch("/api/qrs", { headers:{"Authorization":"Bearer " + _tok} });
      if (t.ok) { show("s-panel"); loadQRs(); return; }
    }
    show("s-login");
  } catch(e) { show("s-login"); }
}

async function doSetup() {
  hideErr("s-err");
  var p1 = document.getElementById("s-pw").value;
  var p2 = document.getElementById("s-pw2").value;
  if (p1.length < 6) { showErr("s-err","Minimo 6 caracteres"); return; }
  if (p1 !== p2) { showErr("s-err","Las contrasenas no coinciden"); return; }
  setLoad("s-btn", true);
  try {
    var r = await fetch("/api/setup", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password:p1}) });
    var d = await r.json();
    setLoad("s-btn", false);
    if (d.ok) { await loginWith(p1); }
    else { showErr("s-err", d.error || "Error al configurar"); }
  } catch(e) { setLoad("s-btn",false); showErr("s-err","Error de red: "+e.message); }
}

async function doLogin() { await loginWith(document.getElementById("l-pw").value); }

async function loginWith(pw) {
  hideErr("l-err"); hideErr("s-err");
  setLoad("l-btn",true); setLoad("s-btn",true);
  try {
    var r = await fetch("/api/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password:pw}) });
    var d = await r.json();
    setLoad("l-btn",false); setLoad("s-btn",false);
    if (d.token) { _tok = d.token; sessionStorage.setItem("qr_t",_tok); show("s-panel"); loadQRs(); }
    else { showErr("l-err", d.error||"Contrasena incorrecta"); showErr("s-err", d.error||"Contrasena incorrecta"); }
  } catch(e) { setLoad("l-btn",false); setLoad("s-btn",false); showErr("l-err","Error: "+e.message); }
}

function logout() { _tok = ""; sessionStorage.removeItem("qr_t"); show("s-login"); }

async function loadQRs() {
  try {
    var r = await fetch("/api/qrs", { headers:{"Authorization":"Bearer "+_tok} });
    var qrs = await r.json();
    var list = document.getElementById("qr-list");
    if (!Array.isArray(qrs) || qrs.length === 0) {
      list.innerHTML = "<div class='empty'><div class='empty-title'>Sin QRs todavia</div><p>Crea tu primer QR arriba.</p></div>";
      document.getElementById("st-total").textContent = "0";
      document.getElementById("st-scans").textContent = "0";
      return;
    }
    var ts = 0, last = null;
    qrs.forEach(function(q) { ts += (q.scans||0); if (q.lastScan&&(!last||q.lastScan>last)) last=q.lastScan; });
    document.getElementById("st-total").textContent = qrs.length;
    document.getElementById("st-scans").textContent = ts;
    document.getElementById("st-last").textContent = last ? new Date(last).toLocaleDateString("es",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "-";
    list.innerHTML = "";
    qrs.forEach(function(qr) {
      var rurl = location.origin + "/r/" + qr.slug;
      var card = document.createElement("div");
      card.className = "qr-card";
      var thumb = document.createElement("div"); thumb.className = "qr-thumb";
      var canvas = document.createElement("canvas"); thumb.appendChild(canvas);
      var info = document.createElement("div"); info.className = "qr-info";
      var lbl = document.createElement("div"); lbl.className = "qr-label"; lbl.textContent = qr.label || qr.slug;
      var sl = document.createElement("div"); sl.className = "qr-slug"; sl.textContent = "/r/" + qr.slug;
      var ur = document.createElement("div"); ur.className = "qr-url"; ur.textContent = qr.url;
      info.appendChild(lbl); info.appendChild(sl); info.appendChild(ur);
      var scans = document.createElement("div"); scans.className = "qr-scans";
      scans.innerHTML = "<div class='qr-scans-num'>"+(qr.scans||0)+"</div><div class='qr-scans-label'>escaneos</div>";
      var acts = document.createElement("div"); acts.className = "qr-actions";
      var bView = document.createElement("button"); bView.className = "btn btn-ghost btn-sm"; bView.textContent = "Ver QR";
      var bEdit = document.createElement("button"); bEdit.className = "btn btn-ghost btn-sm"; bEdit.textContent = "Editar";
      var bDel = document.createElement("button"); bDel.className = "btn btn-danger btn-sm"; bDel.textContent = "Borrar";
      acts.appendChild(bView); acts.appendChild(bEdit); acts.appendChild(bDel);
      card.appendChild(thumb); card.appendChild(info); card.appendChild(scans); card.appendChild(acts);
      list.appendChild(card);
      QRCode.toCanvas(canvas, rurl, { width:66, margin:0, color:{dark:"#000",light:"#fff"} });
      sl.addEventListener("click", function() { navigator.clipboard.writeText(rurl).then(function(){toast("Copiado!","success");}); });
      bView.addEventListener("click", function() {
        document.getElementById("m-qr-url").textContent = rurl;
        document.getElementById("m-qr").dataset.slug = qr.slug;
        QRCode.toCanvas(document.getElementById("m-qr-canvas"), rurl, {width:280,margin:2,color:{dark:"#000",light:"#fff"}});
        openM("m-qr");
      });
      bEdit.addEventListener("click", function() {
        _editSlug = qr.slug;
        document.getElementById("m-edit-slug").textContent = "/r/" + qr.slug;
        document.getElementById("e-url").value = qr.url;
        document.getElementById("e-label").value = qr.label || qr.slug;
        openM("m-edit");
      });
      bDel.addEventListener("click", function() {
        _delSlug = qr.slug;
        document.getElementById("m-del-msg").textContent = "Eliminar el QR /r/" + qr.slug + "? Esta accion no se puede deshacer.";
        openM("m-del");
      });
    });
  } catch(e) { console.error("loadQRs:",e); }
}

async function createQR() {
  var slug = document.getElementById("n-slug").value.trim();
  var url = document.getElementById("n-url").value.trim();
  var label = document.getElementById("n-label").value.trim();
  if (!slug) { toast("El slug es obligatorio","error"); return; }
  if (!url || url.indexOf("http") !== 0) { toast("URL invalida","error"); return; }
  setLoad("c-btn",true);
  try {
    var r = await fetch("/api/qrs", { method:"POST", headers:{"Content-Type":"application/json","Authorization":"Bearer "+_tok}, body:JSON.stringify({slug:slug,url:url,label:label}) });
    var d = await r.json();
    setLoad("c-btn",false);
    if (r.ok) {
      document.getElementById("n-slug").value = "";
      document.getElementById("n-url").value = "";
      document.getElementById("n-label").value = "";
      toast("QR creado!","success"); loadQRs();
    } else { toast(d.error||"Error al crear","error"); }
  } catch(e) { setLoad("c-btn",false); toast("Error: "+e.message,"error"); }
}

async function saveEdit() {
  setLoad("e-btn",true);
  try {
    var r = await fetch("/api/qrs/"+_editSlug, { method:"PUT", headers:{"Content-Type":"application/json","Authorization":"Bearer "+_tok}, body:JSON.stringify({url:document.getElementById("e-url").value,label:document.getElementById("e-label").value}) });
    setLoad("e-btn",false);
    if (r.ok) { closeM("m-edit"); toast("QR actualizado!","success"); loadQRs(); }
    else { toast("Error al guardar","error"); }
  } catch(e) { setLoad("e-btn",false); toast("Error: "+e.message,"error"); }
}

async function confirmDel() {
  setLoad("d-btn",true);
  try {
    await fetch("/api/qrs/"+_delSlug, { method:"DELETE", headers:{"Authorization":"Bearer "+_tok} });
    setLoad("d-btn",false); closeM("m-del"); toast("QR eliminado","success"); loadQRs();
  } catch(e) { setLoad("d-btn",false); toast("Error","error"); }
}

document.getElementById("s-btn").addEventListener("click", doSetup);
document.getElementById("l-btn").addEventListener("click", doLogin);
document.getElementById("l-pw").addEventListener("keydown", function(e){ if(e.key==="Enter") doLogin(); });
document.getElementById("btn-logout").addEventListener("click", logout);
document.getElementById("c-btn").addEventListener("click", createQR);
document.getElementById("e-btn").addEventListener("click", saveEdit);
document.getElementById("e-cancel").addEventListener("click", function(){ closeM("m-edit"); });
document.getElementById("m-qr-dl").addEventListener("click", function(){
  var c = document.getElementById("m-qr-canvas");
  var s = document.getElementById("m-qr").dataset.slug;
  var a = document.createElement("a"); a.download="qr-"+s+".png"; a.href=c.toDataURL("image/png"); a.click();
});
document.getElementById("m-qr-close").addEventListener("click", function(){ closeM("m-qr"); });
document.getElementById("d-btn").addEventListener("click", confirmDel);
document.getElementById("d-cancel").addEventListener("click", function(){ closeM("m-del"); });
document.getElementById("m-edit").addEventListener("click", function(e){ if(e.target===this) closeM("m-edit"); });
document.getElementById("m-qr").addEventListener("click", function(e){ if(e.target===this) closeM("m-qr"); });
document.getElementById("m-del").addEventListener("click", function(e){ if(e.target===this) closeM("m-del"); });

init();
<\/script>
</body>
</html>`;

// Verify syntax of script block
var vm = require("vm");
var scriptStart = html.indexOf("<script>") + 8;
var scriptEnd = html.lastIndexOf("<\/script>");
var scriptContent = html.slice(scriptStart, scriptEnd);
try {
  new vm.Script(scriptContent);
  console.log("SCRIPT SYNTAX: OK");
} catch(e) {
  console.log("SCRIPT SYNTAX ERROR:", e.message);
  process.exit(1);
}

var b64 = Buffer.from(html, "utf8").toString("base64");
console.log("HTML size:", html.length, "B64 size:", b64.length);

var lines = [
  "// free-dynamic-qr v6 - Cloudflare Worker",
  "// https://github.com/alfredgabriel/free-dynamic-qr",
  "// Copy ALL this code into the Cloudflare Workers editor.",
  "",
  "var PANEL_B64 = " + JSON.stringify(b64) + ";",
  "function getHTML() {",
  "  var b = atob(PANEL_B64);",
  "  var bytes = new Uint8Array(b.length);",
  "  for (var i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i);",
  "  return new TextDecoder().decode(bytes);",
  "}",
  "",
  "async function hashPassword(pw) {",
  "  var salt = crypto.getRandomValues(new Uint8Array(16));",
  "  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);",
  "  var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' }, key, 256);",
  "  function h(a) { return Array.from(a).map(function(b) { return b.toString(16).padStart(2, '0'); }).join(''); }",
  "  return h(salt) + ':' + h(new Uint8Array(bits));",
  "}",
  "async function verifyPassword(pw, stored) {",
  "  try {",
  "    var p = stored.split(':');",
  "    var salt = new Uint8Array(p[0].match(/.{2}/g).map(function(b) { return parseInt(b, 16); }));",
  "    var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);",
  "    var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' }, key, 256);",
  "    return Array.from(new Uint8Array(bits)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('') === p[1];",
  "  } catch(e) { return false; }",
  "}",
  "async function createToken(ref) {",
  "  var p = String(Date.now());",
  "  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(ref.slice(0,32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);",
  "  var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(p));",
  "  return p + '.' + Array.from(new Uint8Array(sig)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');",
  "}",
  "async function verifyToken(tok, ref) {",
  "  try {",
  "    var p = tok.split('.');",
  "    var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(ref.slice(0,32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);",
  "    var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(p[0]));",
  "    return Array.from(new Uint8Array(sig)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('') === p[1];",
  "  } catch(e) { return false; }",
  "}",
  "export default {",
  "  async fetch(request, env) {",
  "    var url = new URL(request.url), path = url.pathname;",
  "    var cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization'};",
  "    function json(d, s) { return new Response(JSON.stringify(d), { status: s||200, headers: Object.assign({},cors,{'Content-Type':'application/json'}) }); }",
  "    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });",
  "    if (path === '/' || path === '/admin' || path === '') return new Response(getHTML(), { headers: {'Content-Type':'text/html; charset=utf-8'} });",
  "    if (!env.QR_KV) return json({ error: 'KV binding QR_KV missing. Go to Worker > Bindings > Add > KV namespace, variable name = QR_KV.' }, 500);",
  "    try {",
  "      if (path === '/api/setup' && request.method === 'POST') {",
  "        var body = await request.json();",
  "        if (body.__check) { var ex = await env.QR_KV.get('config:password'); return json(ex ? {configured:true} : {notSetup:true}); }",
  "        if (await env.QR_KV.get('config:password')) return json({error:'Already configured.'},403);",
  "        if (!body.password || body.password.length < 6) return json({error:'Min 6 characters.'},400);",
  "        await env.QR_KV.put('config:password', await hashPassword(body.password));",
  "        return json({ok:true});",
  "      }",
  "      if (path === '/api/login' && request.method === 'POST') {",
  "        var body = await request.json();",
  "        var stored = await env.QR_KV.get('config:password');",
  "        if (!stored) return json({error:'Not set up yet.'},400);",
  "        if (!await verifyPassword(body.password, stored)) return json({error:'Incorrect password.'},401);",
  "        return json({token: await createToken(stored)});",
  "      }",
  "      if (path.startsWith('/r/')) {",
  "        var slug = path.slice(3).replace(/[/]$/,'');",
  "        if (!slug) return Response.redirect(url.origin, 302);",
  "        var data = await env.QR_KV.get('qr:'+slug, 'json');",
  "        if (!data || !data.url) return new Response('QR not found.', {status:404});",
  "        try { await env.QR_KV.put('qr:'+slug, JSON.stringify(Object.assign({},data,{scans:(data.scans||0)+1,lastScan:new Date().toISOString()}))); } catch(e2){}",
  "        return Response.redirect(data.url, 302);",
  "      }",
  "      var tok = (request.headers.get('Authorization')||'').replace('Bearer ','');",
  "      var stored = await env.QR_KV.get('config:password');",
  "      if (!stored||!tok||!await verifyToken(tok,stored)) return json({error:'Unauthorized.'},401);",
  "      if (path === '/api/qrs' && request.method === 'GET') {",
  "        var list = await env.QR_KV.list({prefix:'qr:'});",
  "        var qrs = await Promise.all(list.keys.map(async function(k){ var d=await env.QR_KV.get(k.name,'json'); return d?Object.assign({slug:k.name.replace('qr:','')},d):null; }));",
  "        return json(qrs.filter(Boolean));",
  "      }",
  "      if (path === '/api/qrs' && request.method === 'POST') {",
  "        var body = await request.json();",
  "        if (!body.slug||!body.url) return json({error:'slug and url required.'},400);",
  "        var clean = body.slug.toLowerCase().replace(/[^a-z0-9_-]/g,'');",
  "        if (!clean) return json({error:'Invalid slug.'},400);",
  "        if (await env.QR_KV.get('qr:'+clean)) return json({error:'Slug already in use.'},409);",
  "        var entry = {url:body.url,label:body.label||clean,scans:0,createdAt:new Date().toISOString(),lastScan:null};",
  "        await env.QR_KV.put('qr:'+clean, JSON.stringify(entry));",
  "        return json(Object.assign({slug:clean},entry),201);",
  "      }",
  "      if (path.startsWith('/api/qrs/') && request.method === 'PUT') {",
  "        var slug = path.slice(9);",
  "        var data = await env.QR_KV.get('qr:'+slug,'json');",
  "        if (!data) return json({error:'QR not found.'},404);",
  "        var body = await request.json();",
  "        var upd = Object.assign({},data,body.url?{url:body.url}:{},body.label?{label:body.label}:{},{updatedAt:new Date().toISOString()});",
  "        await env.QR_KV.put('qr:'+slug, JSON.stringify(upd));",
  "        return json(Object.assign({slug:slug},upd));",
  "      }",
  "      if (path.startsWith('/api/qrs/') && request.method === 'DELETE') {",
  "        await env.QR_KV.delete('qr:'+path.slice(9));",
  "        return json({ok:true});",
  "      }",
  "      return json({error:'Not found.'},404);",
  "    } catch(err) { return json({error:'Worker error: '+err.message},500); }",
  "  }",
  "};",
];

fs.writeFileSync("C:/Users/alfre/Desktop/free-dynamic-qr/worker.js", lines.join("\n"), "utf8");
console.log("worker.js written! Lines:", lines.length, "Size:", lines.join("\n").length);
