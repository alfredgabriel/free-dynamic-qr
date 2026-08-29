<div align="center">

# free-dynamic-qr

**Codigos QR dinamicos gratuitos y autoalojados en Cloudflare**

*Olvida pagar $30/mes a QR Tiger o Bitly. 100% gratis para siempre.*

</div>

---

## Que es esto?

Un QR dinamico te permite **cambiar el destino de un QR ya impreso** sin reimprimir nada.

Este proyecto te da exactamente eso, **gratis**, con solo hacer copy/paste en Cloudflare.

- Sin GitHub. Sin terminal. Sin instalaciones.
- Panel web para crear, editar y borrar QRs.
- Contador de escaneos por QR.
- Descarga el QR en PNG listo para imprimir.
- Protegido por contrasena (solo tu gestionas tus QRs).

---

## Deploy en 3 pasos

### Paso 1 — Crear el KV (base de datos gratuita)

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com) (crea cuenta gratis si no tienes)
2. Menu izquierdo: **Storage & databases > Workers KV**
3. Clic en **Create namespace**
4. Name: `QR_KV` → clic **Add**

---

### Paso 2 — Crear el Worker y pegar el codigo

1. Menu izquierdo: **Compute > Workers & Pages**
2. Clic en **Create** → **Create Worker**
3. Ponle un nombre (ej: `my-qr`) → clic **Deploy**
4. Clic en **Edit code**
5. **Borra todo el codigo** que aparece por defecto
6. Abre el archivo `worker.js` de este repositorio, **copia todo el contenido** y pegalo en el editor
7. Clic en **Deploy**

---

### Paso 3 — Conectar el KV al Worker

1. Ve a tu Worker → pestaña **Settings** → seccion **Bindings**
2. Clic en **Add** → **KV namespace**
3. Variable name: `QR_KV`
4. Selecciona el namespace `QR_KV` que creaste en el Paso 1
5. Clic en **Save**

Listo. Abre la URL de tu Worker (algo como `my-qr.workers.dev`), crea tu contrasena y empieza a crear QRs.

---

## Como usar el panel

### Crear un QR
1. Slug: identificador corto, ej: `portfolio`
2. URL de destino: `https://alfredgabriel.com`
3. Nombre: opcional
4. Clic en **Crear QR**

El QR imprime la URL: `my-qr.workers.dev/r/portfolio`

### Cambiar el destino
1. Clic en **Editar** en el QR que quieres cambiar
2. Escribe la nueva URL
3. Clic en **Guardar**

El QR fisico no cambia. Solo cambia a donde lleva.

### Descargar el QR para imprimir
1. Clic en **Ver QR**
2. Clic en **Descargar PNG**

---

## Limites gratuitos de Cloudflare

| Recurso | Limite gratis |
|---|---|
| Workers requests | 100.000/dia |
| KV reads | 100.000/dia |
| KV writes | 1.000/dia |
| Espacio KV | 1 GB |

Mas que suficiente para uso personal o pequeno negocio.

---

## Dominio propio (opcional)

Si tienes un dominio (ej: `miempresa.com`), puedes conectarlo en:
Workers > tu worker > **Settings** > **Domains & Routes** > **Add**

Los QRs pasaran a usar `miempresa.com/r/slug`.

---

## Licencia

MIT
