document.getElementById("quoteForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let size = document.getElementById("size").value;
    let location = document.getElementById("location").value;
    /*
        piscinas-js.js
        ----------------
        Script principal para la página de piscinas.

        Contenido:
        - cambiarCamposForma(): muestra/oculta inputs según la forma seleccionada
        - calcularDosis(): calcula volumen (m³) y dosis de químicos (g)
        - inicialización en DOMContentLoaded: fondo dinámico, listeners de formulario WhatsApp

        Notas:
        - Todas las medidas se asumen en metros (m) y volumen en metros cúbicos (m³).
        - Para cloro se usa como referencia una dosis inicial de 10 ppm → 10 g por m³ de cloro puro (100%).
        - La función `calcularDosis` escribe resultados en el elemento con id="results".
        - Mantener los `id` en el HTML para que los selectores funcionen correctamente.

        Autor: mejora de comentarios para legibilidad
    */

    // --- piscinas-js.js (limpio y consolidado) ---

    // Función para cambiar los campos de medida según la forma de la piscina
    function cambiarCamposForma() {
        const forma = document.getElementById('forma').value;
        const largo = document.getElementById('largo');
        const ancho = document.getElementById('ancho');
        const diametro = document.getElementById('diametro');

        // Ocultar todos los campos primero
        largo.style.display = 'none';
        ancho.style.display = 'none';
        diametro.style.display = 'none';

        largo.required = false;
        ancho.required = false;
        diametro.required = false;

        if (forma === 'rectangular') {
            largo.style.display = 'block';
            ancho.style.display = 'block';
            largo.required = true;
            ancho.required = true;
        } else if (forma === 'circular') {
            diametro.style.display = 'block';
            diametro.required = true;
        } else if (forma === 'ovalada') {
            largo.style.display = 'block';
            ancho.style.display = 'block';
            largo.placeholder = 'Largo Mayor (m)';
            ancho.placeholder = 'Ancho Menor (m)';
            largo.required = true;
            ancho.required = true;
        }
    }

    // Función principal de cálculo
    function calcularDosis() {
        const forma = document.getElementById('forma').value;
        const profundidad = parseFloat(document.getElementById('profundidad').value);
        const resultsDiv = document.getElementById('results');

        let volumen = 0;

        if (isNaN(profundidad) || profundidad <= 0) {
            resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: Ingresa la profundidad promedio.</p>';
            return;
        }

        if (forma === 'rectangular') {
            const largo = parseFloat(document.getElementById('largo').value);
            const ancho = parseFloat(document.getElementById('ancho').value);
            if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
                resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: Ingresa Largo y Ancho válidos.</p>';
                return;
            }
            volumen = largo * ancho * profundidad;

        } else if (forma === 'circular') {
            const diametro = parseFloat(document.getElementById('diametro').value);
            if (isNaN(diametro) || diametro <= 0) {
                resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: Ingresa el Diámetro válido.</p>';
                return;
            }
            const radio = diametro / 2;
            volumen = Math.PI * Math.pow(radio, 2) * profundidad;

        } else if (forma === 'ovalada') {
            const largo = parseFloat(document.getElementById('largo').value);
            const ancho = parseFloat(document.getElementById('ancho').value);
            if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
                resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: Ingresa Largo Mayor y Ancho Menor válidos.</p>';
                return;
            }
            volumen = largo * ancho * profundidad * 0.89;
        }

        if (volumen === 0) {
            resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error al calcular el volumen. Revisa los campos de medida.</p>';
            return;
        }

        const concCloro = parseFloat(document.getElementById('concentracion-cloro').value) || 65;
        const dosisSulfatoAluminio = parseFloat(document.getElementById('dosis-sulfato-aluminio').value) || 15;
        const dosisSulfatoCobre = parseFloat(document.getElementById('dosis-sulfato-cobre').value) || 0.5;

        const dosisCloroPuro = volumen * 10;
        const dosisCloroProducto = dosisCloroPuro / (concCloro / 100);
        const dosisTotalAluminio = volumen * dosisSulfatoAluminio;
        const dosisTotalCobre = volumen * dosisSulfatoCobre;

        resultsDiv.innerHTML = `
            <p>✅ Cálculo completado:</p>
            <p><strong>Volumen Total:</strong> ${volumen.toFixed(2)} m³ (litros: ${(volumen * 1000).toFixed(0)})</p>
            <br>
            <h4>Requerimientos Químicos (Dosis Inicial)</h4>
            <p><strong>Cloro Granulado (${concCloro.toFixed(0)}%):</strong> ${dosisCloroProducto.toFixed(0)} gramos</p>
            <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 10px;">*Basado en dosis de 10 ppm (choque) de cloro activo.</p>
            <p><strong>Sulfato de Aluminio:</strong> ${dosisTotalAluminio.toFixed(0)} gramos</p>
            <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 10px;">*Basado en dosis de ${dosisSulfatoAluminio} g/m³ (floculante).</p>
            <p><strong>Sulfato de Cobre:</strong> ${dosisTotalCobre.toFixed(1)} gramos</p>
            <p style="font-size: 0.85rem; color: #9ca3af;">*Basado en dosis de ${dosisSulfatoCobre} g/m³ (alguicida).</p>
        `;
    }

    // Inicialización y comportamiento dinámico tras carga de DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Fondo dinámico
        const seccion = document.querySelector('.bg-interactive');
        const tarjetas = document.querySelectorAll('.card');
        let indexActual = 0;
        let intervaloAuto;

        // Cambia el background de la sección `.bg-interactive` usando el atributo `data-bg` de cada tarjeta.
        // Ajusta `INTERVAL_MS` para controlar la velocidad del cambio.
        // Nota: intervalos muy cortos (p.ej. <=500ms) pueden provocar mayor uso de CPU y descargas frecuentes
        // de imágenes si no están en cache — por eso pre-cargamos las imágenes abajo.
        const INTERVAL_MS = 500; // 500 ms = medio segundo

        const cambiarFondo = (url) => {
            if (seccion && url) seccion.style.backgroundImage = `url('${url}')`;
        };

        // Pre-carga las imágenes para reducir parpadeo y descargas durante los cambios rápidos
        const preloadImages = () => {
            tarjetas.forEach((tar) => {
                const src = tar.getAttribute('data-bg');
                if (src) {
                    const img = new Image();
                    img.src = src;
                }
            });
        };

        const iniciarAuto = () => {
            if (!tarjetas || tarjetas.length === 0) return;
            clearInterval(intervaloAuto);
            // Empezamos mostrando la imagen inicial (si existe)
            const primera = tarjetas[0].getAttribute('data-bg');
            if (primera) cambiarFondo(primera);
            // Iniciamos el cambio automático usando INTERVAL_MS
            intervaloAuto = setInterval(() => {
                indexActual = (indexActual + 1) % tarjetas.length;
                const proximaImg = tarjetas[indexActual].getAttribute('data-bg');
                cambiarFondo(proximaImg);
            }, INTERVAL_MS);
        };

        // Ejecutar pre-carga inmediatamente
        preloadImages();

        tarjetas.forEach((tarjeta, index) => {
            tarjeta.addEventListener('mouseenter', () => {
                clearInterval(intervaloAuto);
                const img = tarjeta.getAttribute('data-bg');
                cambiarFondo(img);
                indexActual = index;
            });
            tarjeta.addEventListener('mouseleave', () => {
                iniciarAuto();
            });
        });
        iniciarAuto();

        // Formulario WhatsApp
        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            quoteForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('name').value || '';
                const size = document.getElementById('size').value || '';
                const location = document.getElementById('location').value || '';
                const details = document.getElementById('details').value || '';

                const mensaje = `Hola, soy ${name}. Quiero cotizar una piscina.\n- Tamaño: ${size}\n- Ubicación: ${location}\n- Detalles: ${details}`;
                const url = 'https://wa.me/51906892853?text=' + encodeURIComponent(mensaje);
                window.open(url, '_blank');
            });
        }

        // Inicializar campos de la calculadora
        const formaSelect = document.getElementById('forma');
        if (formaSelect) formaSelect.addEventListener('change', cambiarCamposForma);
        cambiarCamposForma();

        // Reemplazo del handler inline: el botón ya no usa `onclick` en el HTML.
        // Añadimos aquí el listener de click que llama a `calcularDosis()`.
        const btnCalcular = document.getElementById('btn-calcular-dosis');
        if (btnCalcular) {
            btnCalcular.addEventListener('click', calcularDosis);
        }
    });