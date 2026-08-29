<div align="center">

# ⬡ Free Dynamic QR

**Códigos QR dinámicos gratuitos y autoalojados en Cloudflare**

*Olvida pagar $30/mes a QR Tiger, Bitly o similares. Esto es 100% gratis para siempre.*

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/TU_USUARIO/free-dynamic-qr)

</div>

---

## ¿Qué es esto?

Un QR dinámico te permite **cambiar el destino de un código QR ya impreso** sin reimprimir nada.

Los servicios comerciales como QR Tiger, Bitly o Beaconstac cobran **$15–50/mes** por esta funcionalidad. Este proyecto te da exactamente lo mismo, **gratis**, usando la infraestructura gratuita de Cloudflare.

**¿Qué incluye?**
- ✅ Redireccionamientos instantáneos sin límite
- ✅ Panel web para crear, editar y eliminar QRs
- ✅ Contador de escaneos por QR
- ✅ Descarga el QR como imagen PNG lista para imprimir
- ✅ Protegido por contraseña (solo tú gestionas tus QRs)
- ✅ Sin base de datos externa — usa Cloudflare KV (gratis)
- ✅ Subdominio gratuito incluido: `tu-proyecto.pages.dev`

---

## 🚀 Deploy en 3 pasos (sin terminal)

### Paso 1 — Haz Fork de este repositorio

Haz clic en el botón **"Fork"** en la esquina superior derecha de esta página.  
Esto crea una copia del proyecto en tu cuenta de GitHub.

---

### Paso 2 — Crea el KV (base de datos) en Cloudflare

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com) e inicia sesión (o crea cuenta gratis)
2. En el menú izquierdo: **Workers & Pages → KV**
3. Clic en **"Create namespace"**
4. Ponle de nombre: `QR_KV`
5. Guarda el **ID** que aparece (lo necesitas en el siguiente paso)

---

### Paso 3 — Conecta tu repo a Cloudflare Pages

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**
2. Conecta tu cuenta de GitHub y selecciona tu fork de `free-dynamic-qr`
3. En la configuración de build:
   - **Build command:** *(dejar en blanco)*
   - **Build output directory:** `public`
4. Antes de hacer Deploy, ve a **"Environment variables"** y añade:
   - Variable: `KV_NAMESPACE_ID` → Valor: el ID que copiaste en el Paso 2
5. Haz clic en **"Save and Deploy"**

✅ ¡Listo! En 30 segundos tendrás tu URL tipo `tu-proyecto.pages.dev`

**Último paso:** Abre `tu-proyecto.pages.dev` en el navegador, crea tu contraseña y empieza a crear QRs.

---

## 🔧 Configurar el KV en wrangler.toml (solo si usas CLI)

Si prefieres el CLI de Wrangler, edita `wrangler.toml` y reemplaza `REEMPLAZAR_CON_TU_KV_ID` con el ID de tu KV namespace.

```toml
[[kv_namespaces]]
binding = "QR_KV"
id = "abc123def456..."  # Tu ID aquí
```

---

## 📱 Cómo usar el panel

### Crear un QR
1. En el campo **"Código (slug)"** escribe un identificador corto, ej: `portfolio`
2. En **"URL de destino"** pega la URL a la que debe redirigir, ej: `https://alfredgabriel.com`
3. (Opcional) Ponle un nombre descriptivo
4. Clic en **"Crear QR"**

El QR apunta a `tu-proyecto.pages.dev/r/portfolio` — esta es la URL que pones dentro del código QR impreso.

### Cambiar el destino
1. En el panel, encuentra el QR que quieres editar
2. Clic en **"Editar"**
3. Cambia la URL de destino
4. Clic en **"Guardar cambios"**

El QR impreso en papel sigue siendo el mismo — ahora redirige a la nueva URL.

### Descargar el QR para imprimir
1. Clic en **"Ver QR"** en cualquier QR de tu lista
2. Clic en **"Descargar PNG"**
3. Imprime o usa la imagen donde necesites

---

## 📊 Límites del plan gratuito de Cloudflare

| Recurso | Límite gratuito |
|---|---|
| Cloudflare Pages | Ilimitado |
| Workers (redirecciones) | 100.000 req/día |
| KV reads | 100.000/día |
| KV writes | 1.000/día |
| Espacio KV | 1 GB |

Para uso personal o pequeño negocio estos límites son más que suficientes.

---

## 🌐 Usar tu propio dominio (opcional)

Si tienes un dominio propio (ej: `miempresa.com`), puedes conectarlo gratis en Cloudflare Pages:

1. **Workers & Pages → tu proyecto → Custom domains**
2. Añade tu dominio
3. Cloudflare configura el DNS automáticamente

Los QRs impresos pasarán a usar `miempresa.com/r/slug` en lugar del subdominio `.pages.dev`.

---

## 🔒 Seguridad

- La contraseña se almacena como hash PBKDF2 con salt aleatorio — nunca en texto plano
- Los tokens de sesión son HMAC firmados
- La API rechaza cualquier solicitud no autenticada

---

## 📄 Licencia

MIT — úsalo libremente, modifícalo, compártelo.

---

<div align="center">
Hecho con ♥ para la comunidad de self-hosting
</div>
