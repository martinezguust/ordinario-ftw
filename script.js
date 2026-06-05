// Plataforma LSM (Lengua de Señas Mexicana)

// Carga un archivo XML y lo convierte en documento
function cargarXML(ruta, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ruta, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var xml = new DOMParser().parseFromString(xhr.responseText, "application/xml");
            callback(xml);
        }
    };
    xhr.send();
}

// Obtiene el texto de una etiqueta XML
function obtenerTexto(xml, etiqueta) {
    var nodo = xml.querySelector(etiqueta);
    return nodo ? nodo.textContent.trim() : "Sin datos";
}

// INICIO
function cargarInicio() {
    cargarXML("inicio.xml", function(xml) {
        var queEs    = xml.querySelector("que-es");
        var abec     = xml.querySelector("abecedario");
        var quienes  = xml.querySelector("quienes");
        var objetivo = xml.querySelector("objetivo");
        var pie      = xml.querySelector("footer");

        document.getElementById("que-es-titulo").textContent       = queEs.querySelector("titulo").textContent.trim();
        document.getElementById("que-es-subtitulo").textContent    = queEs.querySelector("subtitulo").textContent.trim();
        document.getElementById("abecedario-titulo").textContent   = abec.querySelector("titulo").textContent.trim();
        document.getElementById("abecedario-descripcion").textContent = abec.querySelector("descripcion").textContent.trim();
        document.getElementById("abecedario-consejo").textContent  = abec.querySelector("consejo").textContent.trim();
        document.getElementById("quienes-titulo").textContent      = quienes.querySelector("titulo").textContent.trim();
        document.getElementById("quienes-descripcion").textContent = quienes.querySelector("descripcion").textContent.trim();
        document.getElementById("objetivo-titulo").textContent     = objetivo.querySelector("titulo").textContent.trim();
        document.getElementById("objetivo-texto").textContent      = objetivo.querySelector("texto").textContent.trim();
        document.getElementById("objetivo-mision").textContent     = objetivo.querySelector("mision").textContent.trim();
        document.getElementById("footer-texto").textContent        = pie.querySelector("texto").textContent.trim();

        // Párrafos de qué es LSM
        document.getElementById("que-es-parrafos").innerHTML =
            "<p>" + queEs.querySelector("parrafo1").textContent.trim() + "</p>" +
            "<p>" + queEs.querySelector("parrafo2").textContent.trim() + "</p>" +
            "<p>" + queEs.querySelector("parrafo3").textContent.trim() + "</p>";

        // Tarjetas de perfiles
        var perfiles = quienes.querySelectorAll("perfil");
        var contenedor = document.getElementById("quienes-contenedor");
        contenedor.innerHTML = "";
        for (var i = 0; i < perfiles.length; i++) {
            var div = document.createElement("div");
            div.className = "perfil-card";
            div.innerHTML = "<span>" + perfiles[i].querySelector("icono").textContent.trim() + "</span>" +
                            "<h4>" + perfiles[i].querySelector("nombre").textContent.trim() + "</h4>" +
                            "<p>" + perfiles[i].querySelector("texto").textContent.trim() + "</p>";
            contenedor.appendChild(div);
        }
    });
}

// DICCIONARIO
function cargarDiccionario() {
    cargarXML("diccionario.xml", function(xml) {
        document.getElementById("dic-titulo").textContent      = obtenerTexto(xml, "titulo");
        document.getElementById("dic-descripcion").textContent = obtenerTexto(xml, "descripcion");
        window.xmlDiccionario = xml;
        mostrarSenas(xml.querySelectorAll("sena"));

        document.getElementById("buscador-btn").onclick = function() {
            var termino = document.getElementById("buscador-input").value.toLowerCase();
            var todas   = xml.querySelectorAll("sena");
            var resultado = [];
            for (var i = 0; i < todas.length; i++) {
                if (todas[i].querySelector("palabra").textContent.toLowerCase().indexOf(termino) !== -1) {
                    resultado.push(todas[i]);
                }
            }
            mostrarSenas(resultado);
        };
    });
}

function mostrarSenas(lista) {
    var contenedor = document.getElementById("diccionario-contenedor");
    contenedor.innerHTML = "";
    for (var i = 0; i < lista.length; i++) {
        var div = document.createElement("div");
        div.className = "sena-card";
        div.innerHTML = "<h4>" + lista[i].querySelector("palabra").textContent.trim() + "</h4>" +
                        "<span>" + lista[i].querySelector("categoria").textContent.trim() + "</span>" +
                        "<p>" + lista[i].querySelector("descripcion").textContent.trim() + "</p>";
        contenedor.appendChild(div);
    }
}

// CATEGORÍAS
function cargarCategorias() {
    cargarXML("categorias.xml", function(xml) {
        document.getElementById("cat-titulo").textContent      = obtenerTexto(xml, "titulo");
        document.getElementById("cat-descripcion").textContent = obtenerTexto(xml, "descripcion");
        var cats = xml.querySelectorAll("categoria");
        var contenedor = document.getElementById("categorias-contenedor");
        contenedor.innerHTML = "";
        for (var i = 0; i < cats.length; i++) {
            var div = document.createElement("div");
            div.className = "categoria-card";
            div.innerHTML = "<span>" + cats[i].querySelector("icono").textContent.trim() + "</span>" +
                            "<h4>" + cats[i].querySelector("nombre").textContent.trim() + "</h4>" +
                            "<span>" + cats[i].querySelector("total").textContent.trim() + " señas</span>";
            (function(cat) {
                div.onclick = function() {
                    document.getElementById("categorias-contenedor").style.display   = "none";
                    document.getElementById("senas-categoria-seccion").style.display = "block";
                    document.getElementById("nombre-categoria-activa").textContent   = cat.querySelector("nombre").textContent.trim();
                    var senas = cat.querySelectorAll("sena");
                    var cont  = document.getElementById("senas-categoria-contenedor");
                    cont.innerHTML = "";
                    for (var j = 0; j < senas.length; j++) {
                        var s = document.createElement("div");
                        s.className = "sena-card";
                        s.innerHTML = "<h4>" + senas[j].querySelector("palabra").textContent.trim() + "</h4>" +
                                      "<p>" + senas[j].querySelector("descripcion").textContent.trim() + "</p>";
                        cont.appendChild(s);
                    }
                };
            })(cats[i]);
            contenedor.appendChild(div);
        }
        document.getElementById("btn-volver-categorias").onclick = function() {
            document.getElementById("categorias-contenedor").style.display   = "grid";
            document.getElementById("senas-categoria-seccion").style.display = "none";
        };
    });
}

// LECCIONES
function cargarLecciones() {
    cargarXML("lecciones.xml", function(xml) {
        document.getElementById("lec-titulo").textContent      = obtenerTexto(xml, "titulo");
        document.getElementById("lec-descripcion").textContent = obtenerTexto(xml, "descripcion");
        window.xmlLecciones = xml;
        mostrarLecciones("todos");
        var filtros = document.querySelectorAll(".filtro-btn");
        for (var i = 0; i < filtros.length; i++) {
            (function(btn) {
                btn.onclick = function() {
                    for (var j = 0; j < filtros.length; j++) filtros[j].className = "filtro-btn";
                    btn.className = "filtro-btn activo";
                    mostrarLecciones(btn.getAttribute("data-nivel"));
                };
            })(filtros[i]);
        }
        document.getElementById("btn-volver-lecciones").onclick = function() {
            document.getElementById("lecciones-seccion").style.display       = "block";
            document.getElementById("filtro-seccion").style.display          = "block";
            document.getElementById("leccion-detalle-seccion").style.display = "none";
        };
    });
}

function mostrarLecciones(nivel) {
    var lecciones  = window.xmlLecciones.querySelectorAll("leccion");
    var contenedor = document.getElementById("lecciones-contenedor");
    contenedor.innerHTML = "";
    for (var i = 0; i < lecciones.length; i++) {
        var niv = lecciones[i].querySelector("nivel").textContent.trim().toLowerCase();
        if (nivel !== "todos" && niv !== nivel) continue;
        var div = document.createElement("div");
        div.className = "leccion-card";
        div.innerHTML = "<span class='leccion-nivel'>" + niv + "</span>" +
                        "<h4>" + lecciones[i].querySelector("titulo").textContent.trim() + "</h4>" +
                        "<p>" + lecciones[i].querySelector("descripcion").textContent.trim() + "</p>" +
                        "<span>⏱ " + lecciones[i].querySelector("duracion").textContent.trim() + "</span>" +
                        "<button class='btn-ver-leccion'>Ver lección</button>";
        (function(lec) {
            div.querySelector(".btn-ver-leccion").onclick = function() {
                document.getElementById("lecciones-seccion").style.display       = "none";
                document.getElementById("filtro-seccion").style.display          = "none";
                document.getElementById("leccion-detalle-seccion").style.display = "block";
                document.getElementById("leccion-detalle-titulo").textContent    = lec.querySelector("titulo").textContent.trim();
                document.getElementById("leccion-detalle-nivel").textContent     = "Nivel: " + lec.querySelector("nivel").textContent.trim();
                document.getElementById("leccion-detalle-contenido").textContent = lec.querySelector("contenido").textContent.trim();
            };
        })(lecciones[i]);
        contenedor.appendChild(div);
    }
}

// QUIZ
var preguntasQuiz = [], indicePregunta = 0, puntajeQuiz = 0;

function cargarQuiz() {
    cargarXML("quiz.xml", function(xml) {
        document.getElementById("quiz-titulo").textContent      = obtenerTexto(xml, "titulo");
        document.getElementById("quiz-descripcion").textContent = obtenerTexto(xml, "descripcion");
        var nodos = xml.querySelectorAll("pregunta");
        preguntasQuiz = [];
        for (var i = 0; i < nodos.length; i++) preguntasQuiz.push(nodos[i]);
        document.getElementById("quiz-info-contenedor").innerHTML =
            "<p>Total de preguntas: <strong>" + preguntasQuiz.length + "</strong></p>";
        document.getElementById("btn-iniciar-quiz").onclick   = iniciarQuiz;
        document.getElementById("btn-reiniciar-quiz").onclick = reiniciarQuiz;
        document.getElementById("btn-siguiente-pregunta").onclick = function() {
            indicePregunta++;
            if (indicePregunta < preguntasQuiz.length) mostrarPregunta(indicePregunta);
            else mostrarResultados();
        };
    });
}

function iniciarQuiz() {
    indicePregunta = 0; puntajeQuiz = 0;
    document.getElementById("quiz-inicio-seccion").style.display     = "none";
    document.getElementById("quiz-preguntas-seccion").style.display  = "block";
    document.getElementById("quiz-resultados-seccion").style.display = "none";
    mostrarPregunta(0);
}

function mostrarPregunta(i) {
    var p = preguntasQuiz[i];
    document.getElementById("quiz-num-pregunta").textContent      = "Pregunta " + (i + 1) + " de " + preguntasQuiz.length;
    document.getElementById("quiz-puntuacion").textContent        = "Puntaje: " + puntajeQuiz;
    document.getElementById("quiz-pregunta-texto").textContent    = p.querySelector("texto").textContent.trim();
    document.getElementById("quiz-retroalimentacion").textContent = "";
    document.getElementById("btn-siguiente-pregunta").style.display = "none";
    var correcta = p.querySelector("correcta").textContent.trim();
    var opciones = p.querySelectorAll("opcion");
    var cont = document.getElementById("quiz-opciones-contenedor");
    cont.innerHTML = "";
    for (var j = 0; j < opciones.length; j++) {
        var btn = document.createElement("button");
        btn.className = "opcion-btn";
        btn.textContent = opciones[j].textContent.trim();
        (function(valor) {
            btn.onclick = function() {
                var btns = cont.querySelectorAll(".opcion-btn");
                for (var k = 0; k < btns.length; k++) btns[k].disabled = true;
                if (valor === correcta) { puntajeQuiz++; document.getElementById("quiz-retroalimentacion").textContent = "✅ ¡Correcto!"; }
                else document.getElementById("quiz-retroalimentacion").textContent = "❌ Incorrecto. Era: " + correcta;
                document.getElementById("quiz-puntuacion").textContent = "Puntaje: " + puntajeQuiz;
                document.getElementById("btn-siguiente-pregunta").style.display = "inline-block";
            };
        })(btn.textContent);
        cont.appendChild(btn);
    }
}

function mostrarResultados() {
    document.getElementById("quiz-preguntas-seccion").style.display  = "none";
    document.getElementById("quiz-resultados-seccion").style.display = "block";
    var pct = Math.round((puntajeQuiz / preguntasQuiz.length) * 100);
    document.getElementById("resultado-puntaje").textContent = "Obtuviste " + puntajeQuiz + " de " + preguntasQuiz.length + " (" + pct + "%)";
    document.getElementById("resultado-mensaje").textContent = pct >= 80 ? "¡Excelente! 🏆" : pct >= 50 ? "¡Bien! Sigue practicando 💪" : "¡No te rindas! Repasa las lecciones 📖";
}

function reiniciarQuiz() {
    document.getElementById("quiz-resultados-seccion").style.display = "none";
    document.getElementById("quiz-inicio-seccion").style.display     = "block";
    indicePregunta = 0; puntajeQuiz = 0;
}

// RECURSOS
function cargarRecursos() {
    cargarXML("recursos.xml", function(xml) {
        document.getElementById("rec-titulo").textContent      = obtenerTexto(xml, "titulo");
        document.getElementById("rec-descripcion").textContent = obtenerTexto(xml, "descripcion");
        window.xmlRecursos = xml;
        mostrarRecursos("todos");
        var filtros = document.querySelectorAll(".filtro-rec-btn");
        for (var i = 0; i < filtros.length; i++) {
            (function(btn) {
                btn.onclick = function() {
                    for (var j = 0; j < filtros.length; j++) filtros[j].className = "filtro-rec-btn";
                    btn.className = "filtro-rec-btn activo";
                    mostrarRecursos(btn.getAttribute("data-tipo"));
                };
            })(filtros[i]);
        }
    });
}

function mostrarRecursos(tipo) {
    var recursos   = window.xmlRecursos.querySelectorAll("recurso");
    var contenedor = document.getElementById("recursos-contenedor");
    contenedor.innerHTML = "";
    for (var i = 0; i < recursos.length; i++) {
        var tip = recursos[i].querySelector("tipo").textContent.trim().toLowerCase();
        if (tipo !== "todos" && tip !== tipo) continue;
        var div = document.createElement("div");
        div.className = "recurso-card";
        div.innerHTML = "<span class='recurso-tipo'>" + tip + "</span>" +
                        "<h4>" + recursos[i].querySelector("titulo").textContent.trim() + "</h4>" +
                        "<p>" + recursos[i].querySelector("descripcion").textContent.trim() + "</p>" +
                        "<a href='" + recursos[i].querySelector("enlace").textContent.trim() + "' target='_blank'>Ver recurso →</a>";
        contenedor.appendChild(div);
    }
}

// COMUNIDAD
function cargarComunidad() {
    cargarXML("comunidad.xml", function(xml) {
        document.getElementById("com-titulo").textContent      = obtenerTexto(xml, "titulo");
        document.getElementById("com-descripcion").textContent = obtenerTexto(xml, "descripcion");
        document.getElementById("testimonios-titulo").textContent    = obtenerTexto(xml, "testimonios titulo-seccion");
        document.getElementById("organizaciones-titulo").textContent = obtenerTexto(xml, "organizaciones titulo-seccion");
        document.getElementById("faq-titulo").textContent           = obtenerTexto(xml, "faq titulo-seccion");

        // Testimonios
        var tests = xml.querySelectorAll("testimonios testimonio");
        var contTest = document.getElementById("testimonios-contenedor");
        contTest.innerHTML = "";
        for (var i = 0; i < tests.length; i++) {
            var div = document.createElement("div");
            div.className = "testimonio-card";
            div.innerHTML = "<p>\"" + tests[i].querySelector("texto").textContent.trim() + "\"</p>" +
                            "<strong>" + tests[i].querySelector("nombre").textContent.trim() + "</strong>" +
                            "<span> — " + tests[i].querySelector("rol").textContent.trim() + "</span>";
            contTest.appendChild(div);
        }

        // Organizaciones
        var orgs = xml.querySelectorAll("organizaciones organizacion");
        var contOrg = document.getElementById("organizaciones-contenedor");
        contOrg.innerHTML = "";
        for (var j = 0; j < orgs.length; j++) {
            var divO = document.createElement("div");
            divO.className = "org-card";
            divO.innerHTML = "<h4>" + orgs[j].querySelector("nombre").textContent.trim() + "</h4>" +
                             "<p>" + orgs[j].querySelector("descripcion").textContent.trim() + "</p>" +
                             "<a href='" + orgs[j].querySelector("sitio").textContent.trim() + "' target='_blank'>Visitar →</a>";
            contOrg.appendChild(divO);
        }

        // FAQ acordeón
        var pregs = xml.querySelectorAll("faq pregunta");
        var contFAQ = document.getElementById("faq-contenedor");
        contFAQ.innerHTML = "";
        for (var k = 0; k < pregs.length; k++) {
            var divF = document.createElement("div");
            divF.className = "faq-item";
            divF.innerHTML = "<button class='faq-pregunta'>" + pregs[k].querySelector("texto").textContent.trim() + "</button>" +
                             "<p class='faq-respuesta' style='display:none;'>" + pregs[k].querySelector("respuesta").textContent.trim() + "</p>";
            (function(d) {
                d.querySelector(".faq-pregunta").onclick = function() {
                    var r = d.querySelector(".faq-respuesta");
                    r.style.display = r.style.display === "none" ? "block" : "none";
                };
            })(divF);
            contFAQ.appendChild(divF);
        }
    });
}

// DETECCIÓN DE PÁGINA
function detectarPagina() {
    var pagina = window.location.pathname.split("/").pop();
    if      (pagina === "index.html" || pagina === "" || pagina === "inicio.html") cargarInicio();
    else if (pagina === "diccionario.html") cargarDiccionario();
    else if (pagina === "categorias.html")  cargarCategorias();
    else if (pagina === "lecciones.html")   cargarLecciones();
    else if (pagina === "quiz.html")        cargarQuiz();
    else if (pagina === "recursos.html")    cargarRecursos();
    else if (pagina === "comunidad.html")   cargarComunidad();
}

window.onload = function() { detectarPagina(); };