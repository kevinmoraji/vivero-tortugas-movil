# Vivero de Tortugas — App móvil con Framework7

App móvil para que los voluntarios del vivero de tortugas marinas consulten y registren voluntarios desde el celular.
Está hecha con **Framework7 9.3 + React 19** y se conecta a la API REST en Django del vivero.

Proyecto de investigación del curso **IF-0009 Desarrollo de Software IV** — Universidad de Costa Rica, Sede del Pacífico.
Grupo 02, II ciclo 2026.

| Integrante | GitHub |
| --- | --- |
| Kevin Mora Jiménez | kevinmoraji |
| Jimena Fonseca Alvarado | jimeninis |
| Angelina Jiménez Salas | AngJS11 |

## Funcionalidades

- Inicio de sesión con token y roles (Coordinador y Consulta).
- Lista de voluntarios con búsqueda por nombre, apellido o cédula, y deslizar hacia abajo para recargar.
- Detalle de cada voluntario por ruta dinámica (`/voluntarios/:id/`).
- Formulario de registro con validación en el celular y errores de Django debajo de cada campo.
- Aspecto nativo automático: estilo iOS en iPhone y Material Design en Android.
- Se puede instalar como PWA.

## Requisitos

| Herramienta | Versión |
| --- | --- |
| Node.js | 20.19 o superior, o 22.12 o superior (lo exige Vite 8) |
| npm | La que trae Node |
| Navegador | Chrome o Edge. Para ver la vista de celular: F12 y luego el ícono de celular |
| API Django del vivero | Solo si se usa el modo real (ver más abajo) |

## Instalación

```bash
git clone https://github.com/kevinmoraji/vivero-tortugas-movil.git
cd vivero-tortugas-movil
npm install
npm start
```

- En la computadora: http://localhost:5174
- En el celular, conectado a la misma red Wi-Fi: abrir la dirección **Network** que muestra la terminal, por ejemplo `http://192.168.1.50:5174`.

## Modo de prueba y modo real

En `src/js/api.js` hay una constante que elige de dónde salen los datos:

```js
export const USAR_DATOS_DE_PRUEBA = true;
```

**Modo de prueba (`true`).** La app funciona sin Django, con los datos de `src/js/datos-prueba.js`:

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| coordinador | vivero123 | Coordinador: puede registrar voluntarios |
| consulta | vivero123 | Consulta: solo puede ver |

Son datos inventados, no credenciales reales.

**Modo real (`false`).** La app usa la API Django:

1. En `src/js/api.js`, cambiar `URL_BASE_API` por la IP de la computadora donde corre Django.
2. Levantar Django escuchando en la red: `python manage.py runserver 0.0.0.0:8000`.
3. En el `.env` del backend, agregar la IP a `ALLOWED_HOSTS`.
4. Agregar el origen de la app a `CORS_ALLOWED_ORIGINS`, por ejemplo `http://192.168.1.50:5174`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm start` | Servidor de desarrollo con recarga automática en el puerto 5174 |
| `npm run build` | Versión final optimizada y service worker en la carpeta `www/` |

## Estructura

```
vivero-tortugas-movil/
├── package.json            dependencias y scripts
├── vite.config.js          puerto 5174, carpeta src/ y salida www/
├── framework7.json         opciones con que se creó el proyecto
├── demo/                   recursos para la demostración
└── src/
    ├── index.html          punto de entrada: <div id="app"> y js/app.js
    ├── js/
    │   ├── app.js          arranca React y registra Framework7React
    │   ├── routes.js       rutas de la app y protección de sesión
    │   ├── store.js        estado global: token, usuario y roles
    │   ├── api.js          las cuatro funciones que hablan con Django
    │   └── datos-prueba.js datos para trabajar sin servidor
    ├── components/
    │   └── app.jsx         <App> con tema, color, rutas y vista principal
    ├── pages/              una pantalla por archivo
    │   ├── login.jsx
    │   ├── inicio.jsx
    │   ├── voluntarios.jsx
    │   ├── detalle-voluntario.jsx
    │   ├── nuevo-voluntario.jsx
    │   └── 404.jsx
    └── css/app.css         estilos propios
```

## Pantallas

| Ruta | Pantalla | Qué demuestra |
| --- | --- | --- |
| `/login/` | Inicio de sesión | Formulario, Store y navegación sin historial |
| `/inicio/` | Menú principal | `useStore`, diálogo de confirmación |
| `/voluntarios/` | Lista con búsqueda | Listado dinámico, `Searchbar`, evento `onPageBeforeIn` |
| `/voluntarios/:id/` | Detalle | Ruta dinámica con `f7route.params.id` |
| `/voluntarios/nuevo/` | Registro | Validación de `ListInput`, `f7.toast` y manejo de errores 400 y 403 |

## Limitaciones

- La app corre en un WebView o en el navegador, entonces  rinde menos que una app nativa en animaciones pesadas.
- No usa funciones del teléfono como cámara, para eso habría que empaquetarla con Capacitor.
- Dentro de un APK de Capacitor, Android bloquea las conexiones HTTP sin cifrar, entonces la demo principal corre en el navegador del celular.
- La sesión se guarda en `localStorage` del navegador; que es suficiente para una demo, pero no para producción.
- Para compilar la versión de iOS se necesita una Mac con Xcode.