function getAuthHeader() {
    if (usuarioActual == null) {
        return {};
    }

    let token = btoa(usuarioActual.correo + ":" + usuarioActual.contrasena);

    return {
        "Authorization": "Basic " + token
    };
}

async function convertirRespuesta(response) {
    let texto = await response.text();

    if (texto === "") {
        return {
            status: response.status,
            mensaje: "Respuesta sin contenido"
        };
    }

    try {
        return JSON.parse(texto);
    } catch (error) {
        return texto;
    }
}

async function hacerPeticion(endpoint, metodo, body, usarAuth) {
    let headers = {
        "Accept": "application/json, text/plain, */*"
    };

    if (body != null) {
        headers["Content-Type"] = "application/json";
    }

    if (usarAuth) {
        headers = {
            ...headers,
            ...getAuthHeader()
        };
    }

    let opciones = {
        method: metodo,
        headers: headers,
        cache: "no-store"
    };

    if (body != null) {
        opciones.body = JSON.stringify(body);
    }

    try {
        let response = await fetch(baseUrl + endpoint, opciones);
        let data = await convertirRespuesta(response);

        return {
            ok: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            data: "Error de conexión: " + error.message
        };
    }
}
