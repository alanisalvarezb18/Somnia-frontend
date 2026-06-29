function escribirNavbar() {
    let nav = document.getElementById("navbar");

    if (nav == null) {
        return;
    }

    if (usuarioActual == null) {
        nav.innerHTML =
            "<div class='sidebar-logo'>" +
            "<img src='assets/logo-icon.png' alt='Somnia'>" +
            "<div><strong>Somnia</strong><span>Dulces sueños</span></div>" +
            "</div>" +
            "<div class='nav-links'>" +
            crearLinkNav("index.html", "🌙 Login", window.location.pathname.split("/").pop()) +
            crearLinkNav("register.html", "✨ Registro", window.location.pathname.split("/").pop()) +
            "</div>";
        return;
    }

    let paginaActual = window.location.pathname.split("/").pop();

    let contenido =
        "<div class='sidebar-logo'>" +
        "<img src='assets/logo-icon.png' alt='Somnia'>" +
        "<div><strong>Somnia</strong><span>Dulces sueños</span></div>" +
        "</div>" +
        "<div class='nav-links'>" +
        crearLinkNav("dashboard.html", "🏠 Inicio", paginaActual) +
        crearLinkNav("records.html", "🌙 Registros de sueño", paginaActual) +
        crearLinkNav("goals.html", "🎯 Objetivos", paginaActual) +
        crearLinkNav("history.html", "🕒 Historial", paginaActual);

    if (usuarioActual.rol === "ADMIN") {
        contenido += crearLinkNav("users.html", "👥 Usuarios", paginaActual);
    }

    contenido +=
        "</div>" +
        "<div class='sidebar-user'>" +
        "<div class='avatar'>" + obtenerInicialUsuario() + "</div>" +
        "<div><strong>" + usuarioActual.nombre + "</strong><p>" + usuarioActual.rol + "</p></div>" +
        "</div>" +
        "<button class='logout-button' onclick='cerrarSesion()'>🚪 Cerrar sesión</button>";

    nav.innerHTML = contenido;
}

function crearLinkNav(ruta, texto, paginaActual) {
    let clase = "";

    if (ruta === paginaActual) {
        clase = " class='active'";
    }

    return "<a href='" + ruta + "'" + clase + ">" + texto + "</a>";
}

function obtenerInicialUsuario() {
    if (usuarioActual == null || usuarioActual.nombre == null || usuarioActual.nombre.length === 0) {
        return "U";
    }

    return usuarioActual.nombre.substring(0, 1).toUpperCase();
}
