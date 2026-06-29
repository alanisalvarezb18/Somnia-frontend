document.addEventListener("DOMContentLoaded", function () {
    if (!requiereLogin()) {
        return;
    }

    escribirNavbar();
    prepararFormularioRegistro();
    listarRegistros(false);
});

function prepararFormularioRegistro() {
    let fecha = document.getElementById("fechaRegistro");

    if (fecha != null && fecha.value === "") {
        fecha.value = new Date().toISOString().substring(0, 10);
    }
}

function obtenerHoraConSegundos(idCampo) {
    let valor = document.getElementById(idCampo).value;

    if (valor === "") {
        return "";
    }

    if (valor.length === 5) {
        return valor + ":00";
    }

    return valor;
}

function obtenerRegistroFormulario() {
    return {
        fechaRegistro: document.getElementById("fechaRegistro").value,
        horaDormir: obtenerHoraConSegundos("horaDormir"),
        horaDespertar: obtenerHoraConSegundos("horaDespertar"),
        calidadSueno: redondear(document.getElementById("calidadSueno").value),
        observaciones: document.getElementById("observaciones").value.trim(),
        usuarioId: usuarioActual.id
    };
}

function limpiarFormularioRegistro() {
    document.getElementById("fechaRegistro").value = new Date().toISOString().substring(0, 10);
    document.getElementById("horaDormir").value = "";
    document.getElementById("horaDespertar").value = "";
    document.getElementById("calidadSueno").value = "";
    document.getElementById("observaciones").value = "";

    registroActualId = null;
    localStorage.removeItem("registroActualId");
}

async function crearRegistroSueno() {
    let registro = obtenerRegistroFormulario();

    let resultado = await hacerPeticion(
        "/api/sueno",
        "POST",
        registro,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al guardar registro: " + obtenerTextoError(resultado.data));
        return;
    }

    limpiarFormularioRegistro();
    mostrarMensaje("Registro guardado correctamente.");
    await listarRegistros(false);
}

async function listarRegistros(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    mostrarCarga("resultadoRegistros", "Cargando registros...");

    let resultado = await hacerPeticion(
        "/api/sueno/usuario/" + usuarioActual.id,
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarRegistros([]);

        if (mostrarAviso) {
            mostrarMensaje("No hay registros de sueño para mostrar todavía.");
        }
        return;
    }

    mostrarRegistros(resultado.data);

    if (mostrarAviso) {
        mostrarMensaje("Registros actualizados correctamente.");
    }
}

function seleccionarRegistro(registro) {
    registroActualId = registro.id;
    localStorage.setItem("registroActualId", registroActualId);

    document.getElementById("fechaRegistro").value = registro.fechaRegistro;
    document.getElementById("horaDormir").value = formatearHora(registro.horaDormir);
    document.getElementById("horaDespertar").value = formatearHora(registro.horaDespertar);
    document.getElementById("calidadSueno").value = redondear(registro.calidadSueno);
    document.getElementById("observaciones").value = registro.observaciones || "";

    mostrarMensaje("Registro seleccionado para editar.");
}

async function editarRegistro() {
    if (registroActualId == null) {
        mostrarMensaje("Primero seleccione un registro.");
        return;
    }

    let registro = obtenerRegistroFormulario();

    let resultado = await hacerPeticion(
        "/api/sueno/" + registroActualId,
        "PUT",
        registro,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al editar registro: " + obtenerTextoError(resultado.data));
        return;
    }

    limpiarFormularioRegistro();
    mostrarMensaje("Registro editado correctamente.");
    await listarRegistros(false);
}

async function eliminarRegistro() {
    if (registroActualId == null) {
        mostrarMensaje("Primero seleccione un registro.");
        return;
    }

    let resultado = await hacerPeticion(
        "/api/sueno/" + registroActualId,
        "DELETE",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarMensaje("Error al eliminar registro: " + obtenerTextoError(resultado.data));
        return;
    }

    limpiarFormularioRegistro();
    mostrarMensaje("Registro eliminado correctamente.");
    await listarRegistros(false);
}
