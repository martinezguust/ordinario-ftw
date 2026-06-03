// Plataforma LSM (Lengua de Señas Mexicana)

// Carga un archivo XML y lo convierte en documento
function cargarXML(ruta, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
            callback(xmlDoc);
        } else {
            console.error("No se pudo cargar: " + ruta);
        }
    };
    xhr.send();
}

// Obtiene el texto de una etiqueta XML
function obtenerTexto(xmlDoc, etiqueta) {
    var nodo = xmlDoc.querySelector(etiqueta);
    if (nodo) {
        return nodo.textContent.trim();
    }
    return "Sin datos";
}

// PÁGINA 1 - INICIO
function cargarInicio() {
    cargarXML("inicio.xml", function(xml) {
        document.getElementById("hero-titulo").textContent = obtenerTexto(xml, "titulo");
        document.getElementById("hero-descripcion").textContent = obtenerTexto(xml, "descripcion");
    });
}

// PÁGINA 2 - DICCIONARIO
function cargarDiccionario() {
    cargarXML("diccionario.xml", function(xml) {
        document.getElementById("dic-titulo").textContent = obtenerTexto(xml, "titulo");
        document.getElementById("dic-descripcion").textContent = obtenerTexto(xml, "descripcion");

        var senas = xml.querySelectorAll("sena");
        var contenedor = document.getElementById("diccionario-contenedor");
        contenedor.innerHTML = "";

        for (var i = 0; i < senas.length; i++) {
            var palabra = senas[i].querySelector("palabra").textContent.trim();
            var descripcion = senas[i].querySelector("descripcion").textContent.trim();
            var categoria = senas[i].querySelector("categoria").textContent.trim();

            var div = document.createElement("div");
            div.innerHTML = "<h4>" + palabra + "</h4>" +
                            "<span>" + categoria + "</span>" +
                            "<p>" + descripcion + "</p>";
            contenedor.appendChild(div);
        }
    });
}

// PÁGINA 3 - CATEGORÍAS
function cargarCategorias() {
    cargarXML("categorias.xml", function(xml) {
        document.getElementById("cat-titulo").textContent = obtenerTexto(xml, "titulo");
        document.getElementById("cat-descripcion").textContent = obtenerTexto(xml, "descripcion");

        var categorias = xml.querySelectorAll("categoria");
        var contenedor = document.getElementById("categorias-contenedor");
        contenedor.innerHTML = "";

        for (var i = 0; i < categorias.length; i++) {
            var nombre = categorias[i].querySelector("nombre").textContent.trim();
            var icono = categorias[i].querySelector("icono").textContent.trim();

            var div = document.createElement("div");
            div.innerHTML = "<span>" + icono + "</span>" +
                            "<h4>" + nombre + "</h4>";
            contenedor.appendChild(div);
        }
    });
}

// Detecta en qué página estamos y llama la función correcta
function detectarPagina() {
    var pagina = window.location.pathname.split("/").pop();

    if (pagina === "index.html" || pagina === "Index.html" || pagina === "") {
        cargarInicio();
    } else if (pagina === "diccionario.html") {
        cargarDiccionario();
    } else if (pagina === "categorias.html") {
        cargarCategorias();
    }
}

window.onload = function() {
    detectarPagina();
};