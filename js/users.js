document.addEventListener("DOMContentLoaded", function () {
    if (!requiereAdmin()) {
        return;
    }

    escribirNavbar();
    listarUsuarios(false);
});

function esUsuarioActual(usuario) {
    return usuarioActual != null && usuario != null && Number(usuario.id) === Number(usuarioActual.id);
}

function filtrarUsuarioActual(usuarios) {
    if (usuarios == null) {
        return [];
    }

    let filtrados = [];

    for (let usuario of usuarios) {
        if (!esUsuarioActual(usuario)) {
            filtrados.push(usuario);
        }
    }

    return filtrados;
}

async function listarUsuarios(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    mostrarCarga("resultadoUsuarios", "Cargando usuarios...");

    let resultado = await hacerPeticion(
        "/api/users",
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al listar usuarios: " + obtenerTextoError(resultado.data));
        mostrarUsuarios([]);
        return;
    }

    mostrarUsuarios(filtrarUsuarioActual(resultado.data));

    if (mostrarAviso) {
        mostrarMensaje("Usuarios actualizados correctamente.");
    }
}

async function buscarUsuarioPorId() {
    let id = document.getElementById("buscarUsuarioId").value;

    if (id === "") {
        mostrarMensaje("Ingrese un ID de usuario para buscar.");
        return;
    }

    if (Number(id) === Number(usuarioActual.id)) {
        limpiarFormularioUsuario();
        mostrarUsuarios([]);
        mostrarMensaje("El usuario con sesión iniciada se edita desde Mi perfil, no desde Administración.");
        return;
    }

    let resultado = await hacerPeticion(
        "/api/users/" + id,
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al buscar usuario: " + obtenerTextoError(resultado.data));
        return;
    }

    if (esUsuarioActual(resultado.data)) {
        limpiarFormularioUsuario();
        mostrarUsuarios([]);
        mostrarMensaje("El usuario con sesión iniciada se edita desde Mi perfil, no desde Administración.");
        return;
    }

    mostrarUsuarios([resultado.data]);
    seleccionarUsuario(resultado.data);
}

async function buscarUsuarioPorCorreo() {
    let correo = document.getElementById("buscarUsuarioCorreo").value.trim();

    if (correo === "") {
        mostrarMensaje("Ingrese un correo para buscar.");
        return;
    }

    if (usuarioActual != null && correo.toLowerCase() === usuarioActual.correo.toLowerCase()) {
        limpiarFormularioUsuario();
        mostrarUsuarios([]);
        mostrarMensaje("El usuario con sesión iniciada se edita desde Mi perfil, no desde Administración.");
        return;
    }

    let resultado = await hacerPeticion(
        "/api/users/correo/" + correo,
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al buscar usuario: " + obtenerTextoError(resultado.data));
        return;
    }

    if (esUsuarioActual(resultado.data)) {
        limpiarFormularioUsuario();
        mostrarUsuarios([]);
        mostrarMensaje("El usuario con sesión iniciada se edita desde Mi perfil, no desde Administración.");
        return;
    }

    mostrarUsuarios([resultado.data]);
    seleccionarUsuario(resultado.data);
}

function seleccionarUsuario(usuario) {
    if (esUsuarioActual(usuario)) {
        mostrarMensaje("No se puede seleccionar el usuario con sesión iniciada desde esta lista.");
        return;
    }

    usuarioSeleccionadoId = usuario.id;
    localStorage.setItem("usuarioSeleccionadoId", usuarioSeleccionadoId);

    document.getElementById("usuarioIdEditar").value = usuario.id;
    document.getElementById("usuarioNombreEditar").value = usuario.nombre;
    document.getElementById("usuarioCorreoEditar").value = usuario.correo;
    document.getElementById("usuarioRolEditar").value = usuario.rol;
    document.getElementById("usuarioContrasenaEditar").value = "";

    mostrarMensaje("Usuario seleccionado para editar.");
}

function obtenerUsuarioEditado() {
    let usuario = {};
    let nombre = document.getElementById("usuarioNombreEditar").value.trim();
    let correo = document.getElementById("usuarioCorreoEditar").value.trim();
    let contrasena = document.getElementById("usuarioContrasenaEditar").value;
    let rol = document.getElementById("usuarioRolEditar").value;

    if (nombre !== "") {
        usuario.nombre = nombre;
    }

    if (correo !== "") {
        usuario.correo = correo;
    }

    if (contrasena !== "") {
        usuario.contrasena = contrasena;
    }

    if (rol !== "") {
        usuario.rol = rol;
    }

    return usuario;
}

async function editarUsuario() {
    let id = document.getElementById("usuarioIdEditar").value;

    if (id === "") {
        mostrarMensaje("Primero seleccione un usuario.");
        return;
    }

    if (Number(id) === Number(usuarioActual.id)) {
        mostrarMensaje("Su propia información se edita desde Mi perfil.");
        return;
    }

    let usuario = obtenerUsuarioEditado();

    let resultado = await hacerPeticion(
        "/api/users/" + id,
        "PUT",
        usuario,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al editar usuario: " + obtenerTextoError(resultado.data));
        return;
    }

    seleccionarUsuario(resultado.data);
    await listarUsuarios(false);
    mostrarMensaje("Usuario editado correctamente.");
}

async function eliminarUsuario() {
    let id = document.getElementById("usuarioIdEditar").value;

    if (id === "") {
        mostrarMensaje("Primero seleccione un usuario.");
        return;
    }

    if (Number(id) === Number(usuarioActual.id)) {
        mostrarMensaje("No puede eliminar el usuario con la sesión iniciada.");
        return;
    }

    let confirmar = confirm("¿Seguro que desea eliminar el usuario con ID " + id + "?");

    if (!confirmar) {
        return;
    }

    let resultado = await hacerPeticion(
        "/api/users/" + id,
        "DELETE",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al eliminar usuario: " + obtenerTextoError(resultado.data));
        return;
    }

    limpiarFormularioUsuario();
    mostrarMensaje("Usuario eliminado correctamente.");
    await listarUsuarios(false);
}

function limpiarFormularioUsuario() {
    usuarioSeleccionadoId = null;
    localStorage.removeItem("usuarioSeleccionadoId");

    document.getElementById("usuarioIdEditar").value = "";
    document.getElementById("usuarioNombreEditar").value = "";
    document.getElementById("usuarioCorreoEditar").value = "";
    document.getElementById("usuarioContrasenaEditar").value = "";
    document.getElementById("usuarioRolEditar").value = "ESTUDIANTE";
}
