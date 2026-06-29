function requiereLogin() {
    if (usuarioActual == null) {
        window.location.href = "index.html";
        return false;
    }

    return true;
}

function requiereAdmin() {
    if (!requiereLogin()) {
        return false;
    }

    if (usuarioActual.rol !== "ADMIN") {
        mostrarMensaje("Esta sección solo está disponible para usuarios ADMIN.");

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 900);

        return false;
    }

    return true;
}

function limpiarDatosTemporales() {
    objetivoActualId = null;
    registroActualId = null;
    usuarioSeleccionadoId = null;

    localStorage.removeItem("objetivoActualId");
    localStorage.removeItem("registroActualId");
    localStorage.removeItem("usuarioSeleccionadoId");
}

async function registrarUsuario() {
    let usuario = {
        nombre: document.getElementById("registroNombre").value.trim(),
        correo: document.getElementById("registroCorreo").value.trim(),
        contrasena: document.getElementById("registroContrasena").value,
        rol: document.getElementById("registroRol").value
    };

    let resultado = await hacerPeticion(
        "/api/auth/register",
        "POST",
        usuario,
        false
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al registrar usuario: " + obtenerTextoError(resultado.data));
        return;
    }

    limpiarDatosTemporales();

    usuarioActual = {
        id: resultado.data.id,
        nombre: resultado.data.nombre,
        correo: resultado.data.correo,
        rol: resultado.data.rol,
        contrasena: usuario.contrasena
    };

    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

    document.getElementById("registroNombre").value = "";
    document.getElementById("registroCorreo").value = "";
    document.getElementById("registroContrasena").value = "";
    document.getElementById("registroRol").value = "ESTUDIANTE";

    mostrarMensaje("Cuenta creada correctamente. Bienvenido a Somnia.");

    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 700);
}

async function login() {
    let correo = document.getElementById("loginCorreo").value.trim();
    let contrasena = document.getElementById("loginContrasena").value;

    let datosLogin = {
        correo: correo,
        contrasena: contrasena
    };

    let resultado = await hacerPeticion(
        "/api/auth/login",
        "POST",
        datosLogin,
        false
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al iniciar sesión: " + obtenerTextoError(resultado.data));
        return;
    }

    limpiarDatosTemporales();

    usuarioActual = {
        id: resultado.data.id,
        nombre: resultado.data.nombre,
        correo: resultado.data.correo,
        rol: resultado.data.rol,
        contrasena: contrasena
    };

    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

    mostrarMensaje("Inicio de sesión correcto.");

    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 550);
}

function cerrarSesion() {
    usuarioActual = null;
    limpiarDatosTemporales();
    localStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
}
