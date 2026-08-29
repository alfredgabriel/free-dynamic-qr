# Free Dynamic QR

Un acortador de URLs y generador de códigos QR dinámicos **100% gratuito** auto-alojado en tu propia cuenta de Cloudflare (usando Cloudflare Workers). 
Sin suscripciones, sin límites y gestionado desde un panel web elegante.

## Guía de Instalación Paso a Paso

Sigue esta guía visual para configurar tu propio generador de QR dinámicos en menos de 5 minutos. **No se requieren conocimientos técnicos.**

### Paso 1: Crear cuenta en Cloudflare
Lo primero que hay que hacer es entrar en Cloudflare y registrarse con una cuenta nueva en: [dash.cloudflare.com/login](https://dash.cloudflare.com/login)
![Paso 0 - Registro](Captura0.png)

### Paso 2: Crear la Base de Datos (KV)
Una vez logeado, dirígete al apartado **Workers KV** (dentro de *Storage and databases*) y haz clic en **Create a namespace**.
![Paso 1 - Crear KV](Captura1.png)

Una vez creado, en el apartado de métricas podrás ver el nombre que le hemos puesto y el ID asignado. Tenlo en cuenta para un paso futuro.
![Paso 2 - Detalles del KV](Captura2.png)

### Paso 3: Crear la Aplicación (Worker)
Ahora entra a **Workers & Pages** (en el apartado de *Compute*) y pulsa en **Create application**.
![Paso 3 - Crear aplicación](Captura3.png)

La aplicación debe ser del tipo **Start with Hello World!** como marca la flecha.
![Paso 4 - Hello World](Captura4.png)

### Paso 4: Añadir el Código
Una vez creado, en el apartado Overview tenemos que editar el código pulsando el botón **Edit code** que indica la flecha.
![Paso 5 - Editar código](Captura5.png)

En este paso hay que entrar en el repositorio [github.com/alfredgabriel/free-dynamic-qr](https://github.com/alfredgabriel/free-dynamic-qr), copiar todo el contenido del archivo worker.js y pegarlo donde antes estaba el código de Hello World. Por último, pulsa el botón de **Deploy**.
![Paso 6 - Pegar código y Deploy](Captura6.png)

### Paso 5: Conectar la Base de Datos al Código
Ahora hay que salir del editor de código y entrar en la pestaña **Settings > Bindings** y añadir un nuevo binding del tipo **KV namespace**.
![Paso 7 - Añadir Binding](Captura7.png)

Para crear el binding, nos pedirá un nombre de variable: **tienes que poner obligatoriamente QR_KV**. En el desplegable, selecciona el namespace que creaste en el paso 2. Pulsa en Deploy/Guardar.
![Paso 8 - Configurar Variable QR_KV](Captura8.png)

### Paso 6: Configurar tu Contraseña
Ahora hay que volver al *Overview* y pulsar el botón **Visit** para abrir tu aplicación. 
Al entrar por primera vez nos pedirá crear una contraseña, la cual nos pedirá en las próximas visitas para poder entrar a configurar los códigos QR.
![Paso 9 - Crear contraseña](Captura9.png)

### Paso 7: Crear y Gestionar tus QR
¡Listo! Para añadir un código QR necesitaremos añadir un **Slug** (que es el texto que se usará en la URL corta), la **URL de destino** y un **Nombre** (opcional). 

Una vez creado, los códigos QR aparecerán en la lista de abajo. Podrás editarles la URL de destino o el nombre en el futuro si lo necesitas, **¡sin que el QR cambie!**
![Paso 10 - Panel de control](Captura10.png)
