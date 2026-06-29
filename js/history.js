document.addEventListener("DOMContentLoaded", function () {
    if (!requiereLogin()) {
        return;
    }

    escribirNavbar();
    cargarHistorialCompleto(false);
});

async function cargarHistorialCompleto(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    mostrarCarga("resultadoHistorial", "Cargando historial...");
    mostrarCarga("resultadoSeguimiento", "Cargando seguimiento...");

    await Promise.all([
        consultarHistorial(false),
        consultarSeguimiento(false)
    ]);

    if (mostrarAviso) {
        mostrarMensaje("Historial actualizado correctamente.");
    }
}

async function consultarHistorial(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    let resultado = await hacerPeticion(
        "/api/history/" + usuarioActual.id,
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarHistorial([]);

        if (mostrarAviso) {
            mostrarMensaje("No hay historial para mostrar todavía.");
        }
        return;
    }

    mostrarHistorial(resultado.data);

    if (mostrarAviso) {
        mostrarMensaje("Historial actualizado correctamente.");
    }
}

async function consultarSeguimiento(mostrarAviso) {
    if (mostrarAviso == null) {
        mostrarAviso = true;
    }

    let resultado = await hacerPeticion(
        "/api/history/" + usuarioActual.id + "/tracking",
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        mostrarEstadoVacio(
            "resultadoSeguimiento",
            "Agregá un objetivo y registros de sueño para ver el seguimiento."
        );

        if (mostrarAviso) {
            mostrarMensaje("Aún no hay suficiente información para el seguimiento.");
        }
        return;
    }

    mostrarSeguimiento(resultado.data);

    if (mostrarAviso) {
        mostrarMensaje("Seguimiento actualizado correctamente.");
    }
}
