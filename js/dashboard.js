document.addEventListener("DOMContentLoaded", function () {
    if (!requiereLogin()) {
        return;
    }

    escribirNavbar();
    cargarDashboard();
});

async function cargarDashboard() {
    await Promise.all([
        cargarResumenDashboard(),
        cargarRegistrosDashboard()
    ]);
}

async function cargarResumenDashboard() {
    let resultado = await hacerPeticion(
        "/api/history/" + usuarioActual.id + "/tracking",
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        document.getElementById("dashboardCalidad").textContent = "--";
        document.getElementById("dashboardObjetivo").textContent = "--";
        document.getElementById("dashboardCumplidos").textContent = "--";
        return;
    }

    document.getElementById("dashboardCalidad").textContent = formatearCalidad(resultado.data.promedioCalidadSueno);
    document.getElementById("dashboardObjetivo").textContent = formatearHoras(resultado.data.objetivoHoras);
    document.getElementById("dashboardCumplidos").textContent = redondear(resultado.data.registrosCumplidos);
}

async function cargarRegistrosDashboard() {
    let resultado = await hacerPeticion(
        "/api/sueno/usuario/" + usuarioActual.id,
        "GET",
        null,
        true
    );

    if (!resultado.ok) {
        document.getElementById("dashboardHoras").textContent = "--";
        mostrarRegistrosRecientesDashboard([]);
        mostrarGraficaDashboard([]);
        return;
    }

    let registros = resultado.data;

    if (registros.length > 0) {
        document.getElementById("dashboardHoras").textContent = formatearHoras(registros[0].horasDormidas);
    }
    else {
        document.getElementById("dashboardHoras").textContent = "--";
    }

    mostrarRegistrosRecientesDashboard(registros.slice(0, 5));
    mostrarGraficaDashboard(registros.slice(0, 7).reverse());
}

function mostrarRegistrosRecientesDashboard(registros) {
    let contenedor = document.getElementById("dashboardRecientes");
    contenedor.innerHTML = "";

    if (registros.length === 0) {
        contenedor.innerHTML = "<div class='empty-state'>No hay registros recientes.</div>";
        return;
    }

    for (let registro of registros) {
        contenedor.innerHTML += "<div class='item'>" + crearHtmlRegistro(registro) + "</div>";
    }
}

function mostrarGraficaDashboard(registros) {
    let contenedor = document.getElementById("dashboardChart");
    contenedor.innerHTML = "";
    contenedor.classList.remove("empty-state");

    if (registros.length === 0) {
        contenedor.classList.add("empty-state");
        contenedor.textContent = "Cargá tus registros para ver la gráfica.";
        return;
    }

    for (let registro of registros) {
        let horas = redondear(registro.horasDormidas);
        let altura = Math.min((horas / 10) * 100, 100);
        let fecha = registro.fechaRegistro.substring(5);

        contenedor.innerHTML +=
            "<div class='chart-bar-wrapper'>" +
            "<div class='chart-value'>" + horas + "h</div>" +
            "<div class='chart-bar' style='height:" + altura + "%'></div>" +
            "<div class='chart-label'>" + fecha + "</div>" +
            "</div>";
    }
}
