# Frontend - Somnia

Frontend simple para el proyecto académico Somnia.

## Archivos principales

- `index.html`: inicio de sesión.
- `register.html`: registro de usuario.
- `dashboard.html`: panel principal.
- `goals.html`: gestión de objetivos de sueño.
- `records.html`: gestión de registros de sueño.
- `history.html`: historial y seguimiento.
- `users.html`: administración de usuarios para rol ADMIN.
- `styles.css`: estilos visuales del sitio.
- `js/`: funciones JavaScript separadas por módulo.
- `assets/`: logo e iconos visuales del frontend.

## Configuración del backend

La URL del backend se configura en:

```javascript
frontend/js/config.js
```

Actualmente está configurada así:

```javascript
let baseUrl = "https://somnia-czox.onrender.com";
```

Para pruebas locales se puede cambiar por:

```javascript
let baseUrl = "http://localhost:8080";
```

## Uso

1. Ejecutar el backend de Somnia.
2. Abrir `index.html` con Live Preview o desde el navegador.
3. Registrar un usuario o iniciar sesión.
4. Usar las páginas de objetivos, registros e historial.

El frontend realiza peticiones al backend usando `fetch()` y Basic Auth según la configuración actual del backend.
