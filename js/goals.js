document.addEventListener("DOMContentLoaded", function () {
    if (!requiereLogin()) {
        return;
    }

    escribirNavbar();
    consultarObjetivo(false);
});

function obtenerObjetivoFormulario() {
    return {
        horasObjetivo: redondear(document.getElementById("horasObjetivo").value),
        descripcion: document.getElementById("descripcionObjetivo").value.trim(),
        usuarioId: usuarioActual.id
    };
}

function limpiarFormularioObjetivo() {
    document.getElementById("horasObjetivo").value = "";
    document.getElementById("descripcionObjetivo").value = "";
}

async function crearObjetivo() {
    if (usuarioActual == null) {
        mostrarMensaje("Debe iniciar sesión antes de crear un objetivo.");
        return;
    }

    let objetivo = obtenerObjetivoFormulario();

    let resultado = await hacerPeticion(
        "/api/objetivos",
        "POST",
        objetivo,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al crear objetivo: " + obtenerTextoError(resultado.data));
        return;
    }

    objetivoActualId = resultado.data.id;
    localStorage.setItem("objetivoActualId", objetivoActualId);

    document.getElementById("horasObjetivo").value = redondear(resultado.data.horasObjetivo);
    document.getElementById("descripcionObjetivo").value = resultado.data.descripcion || "";

    mostrarObjetivo(resultado.data);
    mostrarMensaje("Objetivo creado correctamente.");
}

async function consultarObjetivo(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    if (usuarioActual == null) {
        mostrarMensaje("Debe iniciar sesión antes de consultar el objetivo.");
        return;
    }

    mostrarCarga("resultadoObjetivo", "Cargando objetivo...");

    let resultado = await hacerPeticion(
        "/api/objetivos/usuario/" + usuarioActual.id,
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        objetivoActualId = null;
        localStorage.removeItem("objetivoActualId");
        mostrarEstadoVacio("resultadoObjetivo", "Todavía no tenés un objetivo registrado.");

        if (mostrarAviso) {
            mostrarMensaje("Aún no hay objetivo registrado para este usuario.");
        }
        return;
    }

    objetivoActualId = resultado.data.id;
    localStorage.setItem("objetivoActualId", objetivoActualId);

    document.getElementById("horasObjetivo").value = redondear(resultado.data.horasObjetivo);
    document.getElementById("descripcionObjetivo").value = resultado.data.descripcion || "";

    mostrarObjetivo(resultado.data);

    if (mostrarAviso) {
        mostrarMensaje("Objetivo actualizado correctamente.");
    }
}

async function editarObjetivo() {
    if (objetivoActualId == null) {
        mostrarMensaje("Primero cree o consulte un objetivo.");
        return;
    }

    let objetivo = obtenerObjetivoFormulario();

    let resultado = await hacerPeticion(
        "/api/objetivos/" + objetivoActualId,
        "PUT",
        objetivo,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al editar objetivo: " + obtenerTextoError(resultado.data));
        return;
    }

    document.getElementById("horasObjetivo").value = redondear(resultado.data.horasObjetivo);
    document.getElementById("descripcionObjetivo").value = resultado.data.descripcion || "";

    mostrarObjetivo(resultado.data);
    mostrarMensaje("Objetivo editado correctamente.");
}

async function eliminarObjetivo() {
    if (objetivoActualId == null) {
        mostrarMensaje("Primero consulte o cree un objetivo.");
        return;
    }

    let resultado = await hacerPeticion(
        "/api/objetivos/" + objetivoActualId,
        "DELETE",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al eliminar objetivo: " + obtenerTextoError(resultado.data));
        return;
    }

    objetivoActualId = null;
    localStorage.removeItem("objetivoActualId");
    limpiarFormularioObjetivo();
    mostrarEstadoVacio("resultadoObjetivo", "Objetivo eliminado. Puede crear uno nuevo.");

    mostrarMensaje("Objetivo eliminado correctamente.");
}
