// ============================================================
//  free-dynamic-qr — Single Cloudflare Worker
//  Paste this entire file in the Cloudflare Workers editor.
//  No GitHub, no CLI, no ZIP needed.
// ============================================================

const PANEL_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Free Dynamic QR — Panel</title>
<meta name="description" content="Gestiona tus QR dinamicos gratuitos autoalojados."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\/script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;--bg2:#111118;--bg3:#1a1a25;--border:#2a2a3a;
  --accent:#7c6bff;--accent2:#a78bfa;--glow:rgba(124,107,255,.2);
  --green:#22d3a3;--red:#f87171;--text:#e8e8f0;--text2:#9090a8;
  --card:rgba(26,26,37,.85);--r:16px;--rs:10px;
}
html,body{height:100%}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(124,107,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,107,255,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
body::after{content:'';position:fixed;top:-200px;left:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(124,107,255,.1) 0%,transparent 70%);pointer-events:none;z-index:0}
#app{position:relative;z-index:1;min-height:100vh}
.auth-screen{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
.auth-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:48px 40px;width:100%;max-width:420px;backdrop-filter:blur(20px);box-shadow:0 0 60px rgba(124,107,255,.1),0 25px 50px rgba(0,0,0,.5)}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.logo-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 20px var(--glow)}
.logo-name{font-size:20px;font-weight:700}
.logo-sub{font-size:12px;color:var(--text2)}
.auth-title{font-size:26px;font-weight:700;margin-bottom:8px}
.auth-sub{color:var(--text2);font-size:14px;margin-bottom:32px;line-height:1.6}
label{display:block;font-size:13px;font-weight:500;color:var(--text2);margin-bottom:8px}
input[type=text],input[type=url],input[type=password]{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:14px 16px;color:var(--text);font-size:15px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--glow)}
.field{margin-bottom:16px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px 24px;border:none;border-radius:var(--rs);font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .2s;margin-top:4px}
.btn-primary{background:linear-gradient(135deg,var(--accent),#6d5ce7);color:#fff;box-shadow:0 4px 20px var(--glow)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px var(--glow)}
.btn-primary:active{transform:translateY(0)}
.btn-danger{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.3);margin-top:0}
.btn-danger:hover{background:rgba(248,113,113,.22)}
.btn-ghost{background:var(--bg3);color:var(--text2);border:1px solid var(--border);margin-top:0}
.btn-ghost:hover{border-color:var(--accent);color:var(--text)}
.btn-sm{width:auto;padding:8px 14px;font-size:13px;border-radius:8px}
.err{color:var(--red);font-size:13px;margin-top:8px;display:none}
.err.show{display:block}
.hidden{display:none!important}
header{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid var(--border);background:rgba(10,10,15,.9);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
.h-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px}
.h-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px}
.h-right{display:flex;align-items:center;gap:12px}
.badge{background:rgba(124,107,255,.12);border:1px solid rgba(124,107,255,.25);color:var(--accent2);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:500}
main{padding:32px;max-width:1100px;margin:0 auto}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:32px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:24px;backdrop-filter:blur(10px);transition:border-color .2s}
.stat:hover{border-color:rgba(124,107,255,.35)}
.stat-label{font-size:12px;color:var(--text2);font-weight:500;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.stat-value{font-size:30px;font-weight:800;background:linear-gradient(135deg,var(--text),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.section{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:28px;backdrop-filter:blur(10px);margin-bottom:28px}
.section-title{font-size:16px;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:8px}
.create-form{display:grid;grid-template-columns:1fr 2fr 1fr auto;gap:12px;align-items:end}
@media(max-width:768px){.create-form{grid-template-columns:1fr}main{padding:16px}header{padding:16px}}
.qr-list{display:flex;flex-direction:column;gap:14px}
.qr-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:22px;backdrop-filter:blur(10px);display:grid;grid-template-columns:auto 1fr auto auto;gap:20px;align-items:center;transition:border-color .2s,transform .2s;animation:fadeIn .3s ease}
.qr-card:hover{border-color:rgba(124,107,255,.3);transform:translateY(-1px)}
.qr-thumb{width:78px;height:78px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:6px;flex-shrink:0}
.qr-thumb canvas{width:66px!important;height:66px!important}
.qr-label{font-weight:600;font-size:16px;margin-bottom:4px}
.qr-slug{font-size:12px;color:var(--accent2);background:rgba(124,107,255,.1);border:1px solid rgba(124,107,255,.2);padding:2px 8px;border-radius:6px;display:inline-block;margin-bottom:8px;cursor:pointer;transition:background .2s}
.qr-slug:hover{background:rgba(124,107,255,.2)}
.qr-url{font-size:13px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:380px}
.qr-scans{text-align:center;flex-shrink:0}
.qr-scans-num{font-size:26px;font-weight:800;color:var(--green)}
.qr-scans-label{font-size:11px;color:var(--text2)}
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
.empty-icon{font-size:56px;margin-bottom:16px}
.empty-title{font-size:19px;font-weight:600;color:var(--text);margin-bottom:8px}
.toast{position:fixed;bottom:24px;right:24px;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:13px 20px;font-size:14px;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,.4);transform:translateY(100px);opacity:0;transition:all .3s cubic-bezier(.34,1.56,.64,1);z-index:2000}
.toast.show{transform:translateY(0);opacity:1}
.toast.success{border-color:rgba(34,211,163,.4);color:var(--green)}
.toast.error{border-color:rgba(248,113,113,.4);color:var(--red)}
.spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:none}
.btn.loading .spin{display:block}
.btn.loading .btn-text{display:none}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div id="app">

<!-- SETUP -->
<div id="s-setup" class="auth-screen">
  <div class="auth-card">
    <div class="logo"><div class="logo-icon">&#11042;</div><div><div class="logo-name">Free Dynamic QR</div><div class="logo-sub">autoalojado en Cloudflare</div></div></div>
    <h1 class="auth-title">Bienvenido &#127881;</h1>
    <p class="auth-sub">Primera vez aqui. Crea una contrasena para proteger tu panel.</p>
    <div class="field"><label for="s-pw">Contrasena (min. 6 caracteres)</label><input id="s-pw" type="password" placeholder="Tu contrasena..." autocomplete="new-password"/></div>
    <div class="field"><label for="s-pw2">Confirmar contrasena</label><input id="s-pw2" type="password" placeholder="Repite..." autocomplete="new-password"/></div>
    <button id="s-btn" class="btn btn-primary" onclick="doSetup()"><div class="spin"></div><span class="btn-text">Crear y entrar &rarr;</span></button>
    <div id="s-err" class="err"></div>
  </div>
</div>

<!-- LOGIN -->
<div id="s-login" class="auth-screen hidden">
  <div class="auth-card">
    <div class="logo"><div class="logo-icon">&#11042;</div><div><div class="logo-name">Free Dynamic QR</div><div class="logo-sub">autoalojado en Cloudflare</div></div></div>
    <h1 class="auth-title">Acceder al panel</h1>
    <p class="auth-sub">Introduce tu contrasena para gestionar tus QRs.</p>
    <div class="field"><label for="l-pw">Contrasena</label><input id="l-pw" type="password" placeholder="Tu contrasena..." autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"/></div>
    <button id="l-btn" class="btn btn-primary" onclick="doLogin()"><div class="spin"></div><span class="btn-text">Entrar &rarr;</span></button>
    <div id="l-err" class="err"></div>
  </div>
</div>

<!-- PANEL -->
<div id="s-panel" class="hidden">
  <header>
    <div class="h-logo"><div class="h-icon">&#11042;</div>Free Dynamic QR</div>
    <div class="h-right"><span class="badge">&#10003; Cloudflare Free</span><button class="btn btn-ghost btn-sm" onclick="logout()">Salir</button></div>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><div class="stat-label">Total QRs</div><div class="stat-value" id="st-total">0</div></div>
      <div class="stat"><div class="stat-label">Escaneos totales</div><div class="stat-value" id="st-scans">0</div></div>
      <div class="stat"><div class="stat-label">Ultimo escaneo</div><div class="stat-value" id="st-last" style="font-size:17px;margin-top:6px">&mdash;</div></div>
    </div>
    <div class="section">
      <div class="section-title">&#10133; Crear nuevo QR</div>
      <div class="create-form">
        <div class="field" style="margin:0"><label for="n-slug">Slug (identificador)</label><input id="n-slug" type="text" placeholder="ej: portfolio"/></div>
        <div class="field" style="margin:0"><label for="n-url">URL de destino</label><input id="n-url" type="url" placeholder="https://alfredgabriel.com"/></div>
        <div class="field" style="margin:0"><label for="n-label">Nombre (opcional)</label><input id="n-label" type="text" placeholder="Mi portfolio"/></div>
        <button id="c-btn" class="btn btn-primary btn-sm" onclick="createQR()" style="height:48px;align-self:end"><div class="spin"></div><span class="btn-text">Crear QR</span></button>
      </div>
    </div>
    <div class="section-title" style="margin-bottom:16px">&#128203; Mis codigos QR</div>
    <div id="qr-list" class="qr-list"></div>
  </main>
</div>

<!-- MODAL EDIT -->
<div id="m-edit" class="modal-overlay" onclick="if(event.target===this)closeM('m-edit')">
  <div class="modal">
    <div class="modal-title">&#9998; Editar QR</div>
    <div class="modal-sub" id="m-edit-slug"></div>
    <div class="field"><label for="e-url">Nueva URL de destino</label><input id="e-url" type="url" placeholder="https://..."/></div>
    <div class="field"><label for="e-label">Nombre</label><input id="e-label" type="text" placeholder="Nombre del QR"/></div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="saveEdit()" id="e-btn"><div class="spin"></div><span class="btn-text">Guardar</span></button>
      <button class="btn btn-ghost" onclick="closeM('m-edit')">Cancelar</button>
    </div>
  </div>
</div>

<!-- MODAL QR IMAGE -->
<div id="m-qr" class="modal-overlay" onclick="if(event.target===this)closeM('m-qr')">
  <div class="modal">
    <div class="modal-title">&#128247; Tu codigo QR</div>
    <div class="modal-sub" id="m-qr-url"></div>
    <div class="qr-preview"><canvas id="m-qr-canvas"></canvas></div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="dlQR()">&#11015; Descargar PNG</button>
      <button class="btn btn-ghost" onclick="closeM('m-qr')">Cerrar</button>
    </div>
  </div>
</div>

<!-- MODAL DELETE -->
<div id="m-del" class="modal-overlay" onclick="if(event.target===this)closeM('m-del')">
  <div class="modal">
    <div class="modal-title">&#128465; Eliminar QR</div>
    <div class="modal-sub" id="m-del-msg"></div>
    <div class="modal-actions">
      <button class="btn btn-danger" onclick="confirmDel()" id="d-btn"><div class="spin"></div><span class="btn-text">Si, eliminar</span></button>
      <button class="btn btn-ghost" onclick="closeM('m-del')">Cancelar</button>
    </div>
  </div>
</div>

<div id="toast" class="toast"></div>
</div>

<script>
let token=sessionStorage.getItem('qr_t')||'',editSlug='',delSlug='';

async function init(){
  try{
    const r=await fetch('/api/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({__check:true})});
    const d=await r.json();
    if(d.notSetup){show('s-setup')}
    else if(token){
      const t=await fetch('/api/qrs',{headers:{Authorization:'Bearer '+token}});
      if(t.ok){show('s-panel');loadQRs()}else{token='';sessionStorage.removeItem('qr_t');show('s-login')}
    }else{show('s-login')}
  }catch{show('s-login')}
}

function show(id){
  ['s-setup','s-login','s-panel'].forEach(s=>document.getElementById(s).classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

async function doSetup(){
  const btn=document.getElementById('s-btn'),err=document.getElementById('s-err');
  const p1=document.getElementById('s-pw').value,p2=document.getElementById('s-pw2').value;
  err.classList.remove('show');
  if(p1.length<6){err.textContent='Minimo 6 caracteres.';err.classList.add('show');return}
  if(p1!==p2){err.textContent='Las contrasenas no coinciden.';err.classList.add('show');return}
  btn.classList.add('loading');
  const r=await fetch('/api/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:p1})});
  const d=await r.json();btn.classList.remove('loading');
  if(d.ok){await loginWith(p1)}else{err.textContent=d.error||'Error.';err.classList.add('show')}
}

async function doLogin(){await loginWith(document.getElementById('l-pw').value)}

async function loginWith(pw){
  const btn=document.getElementById('l-btn')||document.getElementById('s-btn');
  const err=document.getElementById('l-err')||document.getElementById('s-err');
  if(btn)btn.classList.add('loading');
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
  const d=await r.json();
  if(btn)btn.classList.remove('loading');
  if(d.token){token=d.token;sessionStorage.setItem('qr_t',token);show('s-panel');loadQRs()}
  else if(err){err.textContent=d.error||'Contrasena incorrecta.';err.classList.add('show')}
}

function logout(){token='';sessionStorage.removeItem('qr_t');show('s-login')}

async function loadQRs(){
  const r=await fetch('/api/qrs',{headers:{Authorization:'Bearer '+token}});
  const qrs=await r.json();
  const list=document.getElementById('qr-list');
  if(!Array.isArray(qrs)||qrs.length===0){
    list.innerHTML='<div class="empty"><div class="empty-icon">&#11042;</div><div class="empty-title">Sin QRs todavia</div><p>Crea tu primer QR dinamico arriba.</p></div>';
    document.getElementById('st-total').textContent='0';document.getElementById('st-scans').textContent='0';document.getElementById('st-last').textContent='&mdash;';return;
  }
  let ts=0,last=null;
  qrs.forEach(q=>{ts+=q.scans||0;if(q.lastScan&&(!last||q.lastScan>last))last=q.lastScan});
  document.getElementById('st-total').textContent=qrs.length;
  document.getElementById('st-scans').textContent=ts;
  document.getElementById('st-last').textContent=last?new Date(last).toLocaleDateString('es',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'&mdash;';
  list.innerHTML='';
  for(const qr of qrs){
    const card=document.createElement('div');card.className='qr-card';
    const rurl=location.origin+'/r/'+qr.slug;
    card.innerHTML=`
      <div class="qr-thumb"><canvas id="th-${qr.slug}"></canvas></div>
      <div class="qr-info">
        <div class="qr-label">${esc(qr.label||qr.slug)}</div>
        <div class="qr-slug" title="Copiar enlace" onclick="cp('${rurl}')">&#128279; /r/${esc(qr.slug)}</div>
        <div class="qr-url" title="${esc(qr.url)}">&rarr; ${esc(qr.url)}</div>
      </div>
      <div class="qr-scans"><div class="qr-scans-num">${qr.scans||0}</div><div class="qr-scans-label">escaneos</div></div>
      <div class="qr-actions">
        <button class="btn btn-ghost btn-sm" onclick="openQR('${qr.slug}','${rurl}')">Ver QR</button>
        <button class="btn btn-ghost btn-sm" onclick="openEdit('${qr.slug}','${esc(qr.url)}','${esc(qr.label||'')}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="openDel('${qr.slug}')">Borrar</button>
      </div>`;
    list.appendChild(card);
    QRCode.toCanvas(document.getElementById('th-'+qr.slug),rurl,{width:66,margin:0,color:{dark:'#000',light:'#fff'}});
  }
}

async function createQR(){
  const slug=document.getElementById('n-slug').value.trim();
  const url=document.getElementById('n-url').value.trim();
  const label=document.getElementById('n-label').value.trim();
  if(!slug){toast('El slug es obligatorio','error');return}
  if(!url||!url.startsWith('http')){toast('URL invalida','error');return}
  const btn=document.getElementById('c-btn');btn.classList.add('loading');
  const r=await fetch('/api/qrs',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({slug,url,label})});
  const d=await r.json();btn.classList.remove('loading');
  if(r.ok){document.getElementById('n-slug').value='';document.getElementById('n-url').value='';document.getElementById('n-label').value='';toast('QR creado!','success');loadQRs()}
  else toast(d.error||'Error al crear','error');
}

function openEdit(slug,url,label){editSlug=slug;document.getElementById('m-edit-slug').textContent='/r/'+slug;document.getElementById('e-url').value=url;document.getElementById('e-label').value=label;openM('m-edit')}
async function saveEdit(){
  const btn=document.getElementById('e-btn');btn.classList.add('loading');
  const r=await fetch('/api/qrs/'+editSlug,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({url:document.getElementById('e-url').value,label:document.getElementById('e-label').value})});
  btn.classList.remove('loading');
  if(r.ok){closeM('m-edit');toast('QR actualizado!','success');loadQRs()}else toast('Error al guardar','error');
}

function openDel(slug){delSlug=slug;document.getElementById('m-del-msg').textContent='Eliminar el QR /r/'+slug+'? Esta accion no se puede deshacer.';openM('m-del')}
async function confirmDel(){
  const btn=document.getElementById('d-btn');btn.classList.add('loading');
  await fetch('/api/qrs/'+delSlug,{method:'DELETE',headers:{Authorization:'Bearer '+token}});
  btn.classList.remove('loading');closeM('m-del');toast('QR eliminado','success');loadQRs();
}

function openQR(slug,url){
  document.getElementById('m-qr-url').textContent=url;
  document.getElementById('m-qr').dataset.slug=slug;
  QRCode.toCanvas(document.getElementById('m-qr-canvas'),url,{width:280,margin:2,color:{dark:'#000',light:'#fff'}});
  openM('m-qr');
}
function dlQR(){const c=document.getElementById('m-qr-canvas'),s=document.getElementById('m-qr').dataset.slug,a=document.createElement('a');a.download='qr-'+s+'.png';a.href=c.toDataURL('image/png');a.click()}

function openM(id){document.getElementById(id).classList.add('open')}
function closeM(id){document.getElementById(id).classList.remove('open')}
function cp(t){navigator.clipboard.writeText(t).then(()=>toast('Enlace copiado!','success'))}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
let _tt;function toast(msg,type='success'){const t=document.getElementById('toast');t.textContent=(type==='success'?'+ ':'x ')+msg;t.className='toast '+type+' show';clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),3000)}

init();
<\/script>
</body>
</html>`;

// ── CRYPTO HELPERS ────────────────────────────────────────────────────────────

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  const toHex = (arr) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored) {
  try {
    const [saltHex, hashHex] = stored.split(':');
    const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
    const testHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
    return testHex === hashHex;
  } catch { return false; }
}

async function createToken(hashRef) {
  const payload = `${Date.now()}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(hashRef.slice(0, 32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

async function verifyToken(token, hashRef) {
  try {
    const [payload, sigHex] = token.split('.');
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(hashRef.slice(0, 32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const testHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
    return testHex === sigHex;
  } catch { return false; }
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    // ── Serve panel
    if (path === '/' || path === '/admin' || path === '') {
      return new Response(PANEL_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ── QR Redirect
    if (path.startsWith('/r/')) {
      const slug = path.slice(3).replace(/\/$/, '');
      if (!slug) return Response.redirect(url.origin, 302);
      const data = await env.QR_KV.get(`qr:${slug}`, 'json');
      if (!data?.url) return new Response('QR not found.', { status: 404 });
      try {
        await env.QR_KV.put(`qr:${slug}`, JSON.stringify({ ...data, scans: (data.scans || 0) + 1, lastScan: new Date().toISOString() }));
      } catch (_) {}
      return Response.redirect(data.url, 302);
    }

    // ── API: Setup check
    if (path === '/api/setup' && request.method === 'POST') {
      const body = await request.json();
      if (body.__check) {
        const exists = await env.QR_KV.get('config:password');
        return json(exists ? { configured: true } : { notSetup: true });
      }
      const existing = await env.QR_KV.get('config:password');
      if (existing) return json({ error: 'Already configured.' }, 403);
      if (!body.password || body.password.length < 6) return json({ error: 'Min 6 characters.' }, 400);
      await env.QR_KV.put('config:password', await hashPassword(body.password));
      return json({ ok: true });
    }

    // ── API: Login
    if (path === '/api/login' && request.method === 'POST') {
      const { password } = await request.json();
      const stored = await env.QR_KV.get('config:password');
      if (!stored) return json({ error: 'Not set up yet.' }, 400);
      if (!await verifyPassword(password, stored)) return json({ error: 'Incorrect password.' }, 401);
      return json({ token: await createToken(stored) });
    }

    // ── Auth gate
    if (!path.startsWith('/api/')) return new Response('Not found', { status: 404 });

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const stored = await env.QR_KV.get('config:password');
    if (!stored || !token || !await verifyToken(token, stored)) return json({ error: 'Unauthorized.' }, 401);

    // ── API: List QRs
    if (path === '/api/qrs' && request.method === 'GET') {
      const list = await env.QR_KV.list({ prefix: 'qr:' });
      const qrs = await Promise.all(list.keys.map(async k => {
        const d = await env.QR_KV.get(k.name, 'json');
        return d ? { slug: k.name.replace('qr:', ''), ...d } : null;
      }));
      return json(qrs.filter(Boolean));
    }

    // ── API: Create QR
    if (path === '/api/qrs' && request.method === 'POST') {
      const { slug, url: dest, label } = await request.json();
      if (!slug || !dest) return json({ error: 'slug and url required.' }, 400);
      const clean = slug.toLowerCase().replace(/[^a-z0-9\-_]/g, '');
      if (!clean) return json({ error: 'Invalid slug.' }, 400);
      if (await env.QR_KV.get(`qr:${clean}`)) return json({ error: 'Slug already in use.' }, 409);
      const entry = { url: dest, label: label || clean, scans: 0, createdAt: new Date().toISOString(), lastScan: null };
      await env.QR_KV.put(`qr:${clean}`, JSON.stringify(entry));
      return json({ slug: clean, ...entry }, 201);
    }

    // ── API: Edit QR
    if (path.startsWith('/api/qrs/') && request.method === 'PUT') {
      const slug = path.slice(9);
      const data = await env.QR_KV.get(`qr:${slug}`, 'json');
      if (!data) return json({ error: 'QR not found.' }, 404);
      const { url: dest, label } = await request.json();
      const updated = { ...data, ...(dest && { url: dest }), ...(label && { label }), updatedAt: new Date().toISOString() };
      await env.QR_KV.put(`qr:${slug}`, JSON.stringify(updated));
      return json({ slug, ...updated });
    }

    // ── API: Delete QR
    if (path.startsWith('/api/qrs/') && request.method === 'DELETE') {
      await env.QR_KV.delete(`qr:${path.slice(9)}`);
      return json({ ok: true });
    }

    return json({ error: 'Not found.' }, 404);
  }
};
