function mostrarMensaje(mensaje) {
    mostrarToast(mensaje);
}

function mostrarToast(mensaje) {
    let contenedor = document.getElementById("toastContainer");

    if (contenedor == null) {
        contenedor = document.createElement("div");
        contenedor.id = "toastContainer";
        contenedor.className = "toast-container";
        document.body.appendChild(contenedor);
    }

    let tipo = obtenerTipoMensaje(mensaje);
    let toast = document.createElement("div");
    toast.className = "toast " + tipo;

    let icono = "✓";
    let titulo = "Operación realizada";

    if (tipo === "error") {
        icono = "!";
        titulo = "Ocurrió un problema";
    }

    if (tipo === "info") {
        icono = "i";
        titulo = "Somnia";
    }

    let textoLimpio = limpiarMensaje(mensaje);

    toast.innerHTML =
        "<div class='toast-icon'>" + icono + "</div>" +
        "<div><strong>" + titulo + "</strong><p>" + escaparHtml(textoLimpio) + "</p></div>" +
        "<button onclick='this.parentElement.remove()'>×</button>";

    contenedor.appendChild(toast);

    setTimeout(function () {
        if (toast.parentElement != null) {
            toast.remove();
        }
    }, 3800);
}

function obtenerTipoMensaje(mensaje) {
    let texto = String(mensaje).toLowerCase();

    if (texto.includes("error") || texto.includes("incorrect") || texto.includes("problema") || texto.includes("fall")) {
        return "error";
    }

    if (texto.includes("cargando") || texto.includes("bienvenido") || texto.includes("seleccion")) {
        return "info";
    }

    return "success";
}

function limpiarMensaje(mensaje) {
    if (mensaje == null) {
        return "";
    }

    let texto = String(mensaje);

    if (texto.length > 165) {
        texto = texto.substring(0, 165) + "...";
    }

    return texto.replace(/\n/g, " ");
}

function obtenerTextoError(data) {
    if (data == null) {
        return "No se pudo completar la solicitud.";
    }

    if (typeof data === "string") {
        return data;
    }

    let texto = "";

    for (let campo in data) {
        texto += campo + ": " + data[campo] + ". ";
    }

    if (texto === "") {
        texto = "Revise los datos enviados.";
    }

    return texto;
}

function escaparHtml(valor) {
    if (valor == null) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function redondear(valor) {
    let numero = Number(valor);

    if (isNaN(numero)) {
        return 0;
    }

    return Math.round(numero);
}

function formatearHoras(valor) {
    return redondear(valor) + " h";
}

function formatearCalidad(valor) {
    return redondear(valor) + "/5";
}

function formatearHora(valor) {
    if (valor == null) {
        return "--:--";
    }

    return String(valor).substring(0, 5);
}

function mostrarCarga(idContenedor, texto) {
    let contenedor = document.getElementById(idContenedor);

    if (contenedor != null) {
        contenedor.innerHTML = "<div class='empty-state loading-state'>" + texto + "</div>";
    }
}

function mostrarEstadoVacio(idContenedor, texto) {
    let contenedor = document.getElementById(idContenedor);

    if (contenedor != null) {
        contenedor.innerHTML = "<div class='empty-state'>" + texto + "</div>";
    }
}

function mostrarUsuarioEnBarra() {
    let contenedor = document.getElementById("usuarioBarra");

    if (contenedor == null) {
        return;
    }

    if (usuarioActual == null) {
        contenedor.textContent = "Sin sesión";
        return;
    }

    contenedor.textContent = usuarioActual.nombre + " | " + usuarioActual.rol;
}

function mostrarUsuarioActual() {
    let contenedor = document.getElementById("usuarioActual");

    if (contenedor == null) {
        return;
    }

    if (usuarioActual == null) {
        contenedor.innerHTML = "<div class='empty-state'>No hay usuario conectado.</div>";
        return;
    }

    contenedor.innerHTML =
        "<div class='item'>" +
        "<p><strong>ID:</strong> " + usuarioActual.id + "</p>" +
        "<p><strong>Nombre:</strong> " + escaparHtml(usuarioActual.nombre) + "</p>" +
        "<p><strong>Correo:</strong> " + escaparHtml(usuarioActual.correo) + "</p>" +
        "<p><strong>Rol:</strong> <span class='badge'>" + escaparHtml(usuarioActual.rol) + "</span></p>" +
        "</div>";
}

function mostrarObjetivo(objetivo) {
    let contenedor = document.getElementById("resultadoObjetivo");

    if (contenedor == null) {
        return;
    }

    contenedor.innerHTML =
        "<div class='item'>" +
        "<div class='record-row'>" +
        "<div class='record-icon'>🎯</div>" +
        "<div class='record-main'>" +
        "<strong>Objetivo actual</strong>" +
        "<small>" + escaparHtml(objetivo.descripcion || "Sin descripción") + "</small>" +
        "</div>" +
        "<div class='record-score'>" + formatearHoras(objetivo.horasObjetivo) + "<small>ID " + objetivo.id + "</small></div>" +
        "</div>" +
        "<p><strong>Usuario:</strong> " + escaparHtml(objetivo.nombreUsuario) + "</p>" +
        "</div>";
}

function mostrarRegistros(registros) {
    let contenedor = document.getElementById("resultadoRegistros");

    if (contenedor == null) {
        return;
    }

    contenedor.innerHTML = "";

    if (registros == null || registros.length === 0) {
        contenedor.innerHTML = "<div class='empty-state'>No hay registros de sueño todavía.</div>";
        return;
    }

    for (let registro of registros) {
        let div = document.createElement("div");
        div.className = "item clickable";
        div.onclick = function () {
            seleccionarRegistro(registro);
        };

        div.innerHTML = crearHtmlRegistro(registro);
        contenedor.appendChild(div);
    }
}

function crearHtmlRegistro(registro) {
    return "<div class='record-row'>" +
        "<div class='record-icon'>🌙</div>" +
        "<div class='record-main'>" +
        "<strong>" + escaparHtml(registro.fechaRegistro) + "</strong>" +
        "<small>" + formatearHora(registro.horaDormir) + " - " + formatearHora(registro.horaDespertar) + "</small>" +
        "<small>" + escaparHtml(registro.observaciones || "Sin observaciones") + "</small>" +
        "</div>" +
        "<div class='record-score'>" + formatearHoras(registro.horasDormidas) + "<small>⭐ " + formatearCalidad(registro.calidadSueno) + "</small></div>" +
        "</div>";
}

function mostrarHistorial(registros) {
    let contenedor = document.getElementById("resultadoHistorial");

    if (contenedor == null) {
        return;
    }

    contenedor.innerHTML = "";

    if (registros == null || registros.length === 0) {
        contenedor.innerHTML = "<div class='empty-state'>No hay datos en el historial todavía. Guardá un registro para empezar.</div>";
        return;
    }

    for (let registro of registros) {
        contenedor.innerHTML += "<div class='item'>" + crearHtmlRegistro(registro) + "</div>";
    }
}

function mostrarSeguimiento(data) {
    let contenedor = document.getElementById("resultadoSeguimiento");

    if (contenedor == null) {
        return;
    }

    if (data == null) {
        contenedor.innerHTML = "<div class='empty-state'>Aún no hay suficiente información para mostrar seguimiento.</div>";
        return;
    }

    let total = redondear(data.totalRegistros);
    let promedioHoras = redondear(data.promedioHorasDormidas);
    let promedioCalidad = redondear(data.promedioCalidadSueno);
    let cumplidos = redondear(data.registrosCumplidos);
    let noCumplidos = redondear(data.registrosNoCumplidos);
    let objetivo = redondear(data.objetivoHoras);
    let porcentaje = 0;

    if (total > 0) {
        porcentaje = Math.round((cumplidos / total) * 100);
    }

    let estadoMeta = "Todavía falta información para evaluar tu meta.";
    let consejo = "Agregá registros durante varios días para que Somnia pueda darte una lectura más útil.";

    if (total > 0 && objetivo > 0) {
        if (promedioHoras >= objetivo) {
            estadoMeta = "Vas cumpliendo tu objetivo de sueño en promedio.";
            consejo = "Mantené una hora parecida para dormir y despertar; eso ayuda a conservar la rutina.";
        }
        else {
            estadoMeta = "Tu promedio está por debajo del objetivo configurado.";
            consejo = "Intentá acostarte un poco antes o reducir pantallas antes de dormir.";
        }
    }

    let textoCalidad = "Calidad estable";

    if (promedioCalidad >= 4) {
        textoCalidad = "Buena calidad de sueño";
    }
    else if (promedioCalidad <= 2 && total > 0) {
        textoCalidad = "Calidad baja, conviene revisar hábitos";
    }

    contenedor.innerHTML =
        "<div class='summary-grid compact-summary'>" +
        crearMiniStat("Registros", total, "🛌") +
        crearMiniStat("Promedio", formatearHoras(promedioHoras), "💤") +
        crearMiniStat("Calidad", formatearCalidad(promedioCalidad), "⭐") +
        crearMiniStat("Cumplidos", cumplidos, "🎯") +
        "</div>" +
        "<div class='tracking-detail'>" +
        "<h3>Resumen simple</h3>" +
        "<p>Tu objetivo actual es dormir <strong>" + formatearHoras(objetivo) + "</strong> por noche.</p>" +
        "<p>Has cumplido la meta en <strong>" + cumplidos + " de " + total + "</strong> registros, aproximadamente <strong>" + porcentaje + "%</strong>.</p>" +
        "<p>No cumplidos: <strong>" + noCumplidos + "</strong>.</p>" +
        "<div class='tracking-highlight'>" + estadoMeta + "</div>" +
        "<div class='tracking-advice'><strong>Lectura:</strong> " + textoCalidad + ".<br><strong>Consejo:</strong> " + consejo + "</div>" +
        "</div>";
}

function crearMiniStat(titulo, valor, icono) {
    return "<div class='metric-card mini-stat'>" +
        "<span class='metric-icon'>" + icono + "</span>" +
        "<p>" + titulo + "</p>" +
        "<h2>" + valor + "</h2>" +
        "</div>";
}

function mostrarUsuarios(usuarios) {
    let contenedor = document.getElementById("resultadoUsuarios");

    if (contenedor == null) {
        return;
    }

    contenedor.innerHTML = "";

    if (usuarios == null || usuarios.length === 0) {
        contenedor.innerHTML = "<div class='empty-state'>No hay usuarios para mostrar.</div>";
        return;
    }

    for (let usuario of usuarios) {
        let div = document.createElement("div");
        div.className = "item clickable";
        div.onclick = function () {
            seleccionarUsuario(usuario);
        };

        div.innerHTML =
            "<div class='record-row'>" +
            "<div class='avatar'>" + obtenerInicial(usuario.nombre) + "</div>" +
            "<div class='record-main'>" +
            "<strong>" + escaparHtml(usuario.nombre) + "</strong>" +
            "<small>" + escaparHtml(usuario.correo) + "</small>" +
            "</div>" +
            "<span class='badge'>" + escaparHtml(usuario.rol) + "</span>" +
            "</div>";

        contenedor.appendChild(div);
    }
}

function obtenerInicial(nombre) {
    if (nombre == null || nombre.length === 0) {
        return "U";
    }

    return nombre.substring(0, 1).toUpperCase();
}
