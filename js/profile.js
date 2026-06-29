document.addEventListener("DOMContentLoaded", function () {
    if (!requiereLogin()) {
        return;
    }

    escribirNavbar();
    cargarPerfil(false);
});

async function cargarPerfil(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    let resultado = await hacerPeticion(
        "/api/users/perfil/" + usuarioActual.id,
        "GET",
        null,
        true
    );

    if (resultado.ok) {
        usuarioActual.id = resultado.data.id;
        usuarioActual.nombre = resultado.data.nombre;
        usuarioActual.correo = resultado.data.correo;
        usuarioActual.rol = resultado.data.rol;
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    }

    pintarPerfil();

    if (!resultado.ok && mostrarAviso) {
        mostrarMensaje("No se pudo actualizar el perfil desde el backend: " + obtenerTextoError(resultado.data));
    }
}

function pintarPerfil() {
    document.getElementById("perfilInicial").textContent = obtenerInicial(usuarioActual.nombre);
    document.getElementById("perfilNombreActual").textContent = usuarioActual.nombre;
    document.getElementById("perfilCorreoActual").textContent = usuarioActual.correo;
    document.getElementById("perfilRolActual").textContent = usuarioActual.rol;

    document.getElementById("perfilNombre").value = usuarioActual.nombre || "";
    document.getElementById("perfilCorreo").value = usuarioActual.correo || "";
    document.getElementById("perfilContrasena").value = "";

    escribirNavbar();
}

function obtenerDatosPerfil() {
    let datos = {};
    let nombre = document.getElementById("perfilNombre").value.trim();
    let correo = document.getElementById("perfilCorreo").value.trim();
    let contrasena = document.getElementById("perfilContrasena").value;

    if (nombre !== "" && nombre !== usuarioActual.nombre) {
        datos.nombre = nombre;
    }

    if (correo !== "" && correo !== usuarioActual.correo) {
        datos.correo = correo;
    }

    if (contrasena !== "") {
        datos.contrasena = contrasena;
    }

    return datos;
}

async function guardarPerfil() {
    let datos = obtenerDatosPerfil();
    let nuevaContrasena = document.getElementById("perfilContrasena").value;

    if (Object.keys(datos).length === 0) {
        mostrarMensaje("No hay cambios para guardar.");
        return;
    }

    let resultado = await hacerPeticion(
        "/api/users/perfil/" + usuarioActual.id,
        "PUT",
        datos,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al actualizar perfil: " + obtenerTextoError(resultado.data));
        return;
    }

    usuarioActual.id = resultado.data.id;
    usuarioActual.nombre = resultado.data.nombre;
    usuarioActual.correo = resultado.data.correo;
    usuarioActual.rol = resultado.data.rol;

    if (nuevaContrasena !== "") {
        usuarioActual.contrasena = nuevaContrasena;
    }

    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    pintarPerfil();
    mostrarMensaje("Perfil actualizado correctamente.");
}
