document.addEventListener("DOMContentLoaded", function () {
    if (!requiereAdmin()) {
        return;
    }

    escribirNavbar();
    listarUsuarios(false);
});

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

    mostrarUsuarios(resultado.data);

    if (mostrarAviso) {
        mostrarMensaje("Usuarios actualizados correctamente.");
    }
}

async function buscarUsuarioPorId() {
    let id = document.getElementById("buscarUsuarioId").value;

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

    mostrarUsuarios([resultado.data]);
    seleccionarUsuario(resultado.data);
}

async function buscarUsuarioPorCorreo() {
    let correo = document.getElementById("buscarUsuarioCorreo").value.trim();

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

    mostrarUsuarios([resultado.data]);
    seleccionarUsuario(resultado.data);
}

function seleccionarUsuario(usuario) {
    usuarioSeleccionadoId = usuario.id;
    localStorage.setItem("usuarioSeleccionadoId", usuarioSeleccionadoId);

    document.getElementById("usuarioIdEditar").value = usuario.id;
    document.getElementById("usuarioNombreEditar").value = usuario.nombre;
    document.getElementById("usuarioCorreoEditar").value = usuario.correo;
    document.getElementById("usuarioRolEditar").value = usuario.rol;
    document.getElementById("usuarioContrasenaEditar").value = "";

    mostrarMensaje("Usuario seleccionado para editar.");
}

async function editarUsuario() {
    let id = document.getElementById("usuarioIdEditar").value;

    if (id === "") {
        mostrarMensaje("Primero seleccione o ingrese un usuario.");
        return;
    }

    let usuario = {
        nombre: document.getElementById("usuarioNombreEditar").value.trim(),
        correo: document.getElementById("usuarioCorreoEditar").value.trim(),
        contrasena: document.getElementById("usuarioContrasenaEditar").value,
        rol: document.getElementById("usuarioRolEditar").value
    };

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

    mostrarUsuarios([resultado.data]);
    mostrarMensaje("Usuario editado correctamente.");
}

async function eliminarUsuario() {
    let id = document.getElementById("usuarioIdEditar").value;

    if (id === "") {
        mostrarMensaje("Primero seleccione o ingrese un usuario.");
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

    usuarioSeleccionadoId = null;
    localStorage.removeItem("usuarioSeleccionadoId");

    document.getElementById("usuarioIdEditar").value = "";
    document.getElementById("usuarioNombreEditar").value = "";
    document.getElementById("usuarioCorreoEditar").value = "";
    document.getElementById("usuarioContrasenaEditar").value = "";
    document.getElementById("usuarioRolEditar").value = "ESTUDIANTE";

    mostrarMensaje("Usuario eliminado correctamente.");
    await listarUsuarios(false);
}
