let objetivoConsultado = null;

/*
    Flujo de objetivos:
    - Al entrar a la página se consulta el objetivo actual.
    - El formulario queda limpio para evitar datos pegados.
    - Para editar o eliminar, primero se selecciona la tarjeta del objetivo.
*/
document.addEventListener("DOMContentLoaded", function () {
    if (!requiereLogin()) {
        return;
    }

    escribirNavbar();
    limpiarFormularioObjetivo();
    consultarObjetivo(false);
});

function obtenerHorasObjetivo() {
    let valor = document.getElementById("horasObjetivo").value.trim();

    if (valor === "") {
        return null;
    }

    let numero = Number(valor);

    if (isNaN(numero)) {
        return null;
    }

    return redondear(numero);
}

function validarHorasParaCrear(horas) {
    if (horas == null) {
        mostrarMensaje("Ingrese la cantidad de horas objetivo.");
        return false;
    }

    if (horas < 1 || horas > 12) {
        mostrarMensaje("Las horas objetivo deben estar entre 1 y 12.");
        return false;
    }

    return true;
}

function obtenerObjetivoCreacion() {
    let horas = obtenerHorasObjetivo();

    if (!validarHorasParaCrear(horas)) {
        return null;
    }

    return {
        horasObjetivo: horas,
        descripcion: document.getElementById("descripcionObjetivo").value.trim(),
        usuarioId: usuarioActual.id
    };
}

function obtenerObjetivoEdicion() {
    let objetivo = {
        usuarioId: usuarioActual.id
    };

    let horas = obtenerHorasObjetivo();
    let descripcion = document.getElementById("descripcionObjetivo").value.trim();

    if (horas != null) {
        if (horas < 1 || horas > 12) {
            mostrarMensaje("Las horas objetivo deben estar entre 1 y 12.");
            return null;
        }

        objetivo.horasObjetivo = horas;
    }

    /*
       La descripción se envía siempre para que también se pueda borrar
       dejándola vacía de forma intencional.
    */
    objetivo.descripcion = descripcion;

    return objetivo;
}

function limpiarFormularioObjetivo() {
    document.getElementById("horasObjetivo").value = "";
    document.getElementById("descripcionObjetivo").value = "";

    objetivoActualId = null;
    localStorage.removeItem("objetivoActualId");
    actualizarEstadoSeleccionObjetivo();
}

function actualizarEstadoSeleccionObjetivo() {
    let texto = document.getElementById("objetivoSeleccionadoTexto");

    if (texto == null) {
        return;
    }

    if (objetivoActualId == null) {
        texto.textContent = "Ningún objetivo seleccionado";
        texto.className = "selection-pill";
    }
    else {
        texto.textContent = "Objetivo seleccionado: ID " + objetivoActualId;
        texto.className = "selection-pill active";
    }
}

function seleccionarObjetivoActual() {
    if (objetivoConsultado == null) {
        mostrarMensaje("Primero consulte o cree un objetivo.");
        return;
    }

    objetivoActualId = objetivoConsultado.id;
    localStorage.setItem("objetivoActualId", objetivoActualId);

    document.getElementById("horasObjetivo").value = redondear(objetivoConsultado.horasObjetivo);
    document.getElementById("descripcionObjetivo").value = objetivoConsultado.descripcion || "";

    actualizarEstadoSeleccionObjetivo();
    mostrarObjetivo(objetivoConsultado);
    mostrarMensaje("Objetivo seleccionado para editar o eliminar.");
}

async function crearObjetivo() {
    if (usuarioActual == null) {
        mostrarMensaje("Debe iniciar sesión antes de crear un objetivo.");
        return;
    }

    let objetivo = obtenerObjetivoCreacion();

    if (objetivo == null) {
        return;
    }

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

    objetivoConsultado = resultado.data;
    limpiarFormularioObjetivo();
    mostrarObjetivo(objetivoConsultado);
    mostrarMensaje("Objetivo creado correctamente. Seleccionelo de la tarjeta para editarlo o eliminarlo.");
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
        objetivoConsultado = null;
        limpiarFormularioObjetivo();
        mostrarEstadoVacio("resultadoObjetivo", "Todavía no tenés un objetivo registrado.");

        if (mostrarAviso) {
            mostrarMensaje("Aún no hay objetivo registrado para este usuario.");
        }
        return;
    }

    objetivoConsultado = resultado.data;
    limpiarFormularioObjetivo();
    mostrarObjetivo(objetivoConsultado);

    if (mostrarAviso) {
        mostrarMensaje("Objetivo consultado correctamente. Seleccionelo de la tarjeta para editarlo o eliminarlo.");
    }
}

async function editarObjetivo() {
    if (objetivoActualId == null) {
        mostrarMensaje("Primero seleccione el objetivo desde la tarjeta de la derecha.");
        return;
    }

    let objetivo = obtenerObjetivoEdicion();

    if (objetivo == null) {
        return;
    }

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

    objetivoConsultado = resultado.data;
    limpiarFormularioObjetivo();
    mostrarObjetivo(objetivoConsultado);
    mostrarMensaje("Objetivo editado correctamente.");
}

async function eliminarObjetivo() {
    if (objetivoActualId == null) {
        mostrarMensaje("Primero seleccione el objetivo desde la tarjeta de la derecha.");
        return;
    }

    let confirmar = confirm("¿Seguro que desea eliminar el objetivo seleccionado?");

    if (!confirmar) {
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

    objetivoConsultado = null;
    limpiarFormularioObjetivo();
    mostrarEstadoVacio("resultadoObjetivo", "Objetivo eliminado. Puede crear uno nuevo.");

    mostrarMensaje("Objetivo eliminado correctamente.");
}
