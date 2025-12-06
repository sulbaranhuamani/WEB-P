document.getElementById("quoteForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let size = document.getElementById("size").value;
    let location = document.getElementById("location").value;
    let details = document.getElementById("details").value;

    let mensaje = `Hola, soy ${name}. Quiero cotizar una piscina.\n
Tamaño: ${size}\n
Ubicación: ${location}\n
Detalles: ${details}`;

    let url = "https://wa.me/51XXXXXXXXX?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank");
});


///piscinas
// --- Funciones de Lógica de la Calculadora ---

// Función para cambiar los campos de medida según la forma de la piscina
function cambiarCamposForma() {
    const forma = document.getElementById('forma').value;
    const largo = document.getElementById('largo');
    const ancho = document.getElementById('ancho');
    const diametro = document.getElementById('diametro');

    // Ocultar todos los campos de dimensión primero
    largo.style.display = 'none';
    ancho.style.display = 'none';
    diametro.style.display = 'none';

    // Asignar el atributo 'required' y mostrar solo los necesarios
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
        largo.style.display = 'block'; // Largo mayor
        ancho.style.display = 'block'; // Ancho menor
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

    // 1. Obtener y validar las dimensiones
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
        // Volumen Rectangular = Largo × Ancho × Profundidad
        volumen = largo * ancho * profundidad;

    } else if (forma === 'circular') {
        const diametro = parseFloat(document.getElementById('diametro').value);
        if (isNaN(diametro) || diametro <= 0) {
            resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: Ingresa el Diámetro válido.</p>';
            return;
        }
        const radio = diametro / 2;
        // Volumen Circular = π × Radio² × Profundidad
        volumen = Math.PI * Math.pow(radio, 2) * profundidad;

    } else if (forma === 'ovalada') {
        const largo = parseFloat(document.getElementById('largo').value); // Eje mayor A
        const ancho = parseFloat(document.getElementById('ancho').value); // Eje menor B
        if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
            resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: Ingresa Largo Mayor y Ancho Menor válidos.</p>';
            return;
        }
        // Volumen Ovalado = Largo × Ancho × Profundidad × 0.89 (Factor aproximado para óvalos)
        volumen = largo * ancho * profundidad * 0.89; // Factor de corrección común

    }

    // Si el volumen sigue siendo 0, algo salió mal
    if (volumen === 0) {
        resultsDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold; text-align: center;">Error al calcular el volumen. Revisa los campos de medida.</p>';
        return;
    }

    // 2. Obtener y validar las Dosis y Concentraciones (usando valores por defecto si están vacíos)
    const concCloro = parseFloat(document.getElementById('concentracion-cloro').value) || 65; // %
    const dosisSulfatoAluminio = parseFloat(document.getElementById('dosis-sulfato-aluminio').value) || 15; // g/m³
    const dosisSulfatoCobre = parseFloat(document.getElementById('dosis-sulfato-cobre').value) || 0.5; // g/m³

    // 3. Calcular Dosis de Químicos
    // A. CLORO (Se usa una dosis inicial/de choque de 10ppm = 10g por m³ de Cloro 100%)
    const dosisCloroPuro = volumen * 10; // Gramos de Cloro puro (100%)

    // Corregir la dosis según el porcentaje de concentración del producto
    // Dosis del Producto = Dosis Pura / (Concentración / 100)
    const dosisCloroProducto = dosisCloroPuro / (concCloro / 100);

    // B. SULFATO DE ALUMINIO (Floculante)
    const dosisTotalAluminio = volumen * dosisSulfatoAluminio;

    // C. SULFATO DE COBRE (Alguicida)
    const dosisTotalCobre = volumen * dosisSulfatoCobre;


    // 4. Mostrar Resultados
    resultsDiv.innerHTML = `
        <p>✅ **Cálculo completado:**</p>
        <p><strong>Volumen Total:</strong> ${volumen.toFixed(2)} m³ (litros: ${(volumen * 1000).toFixed(0)})</p>
        
        <br>
        <h4>Requerimientos Químicos (Dosis Inicial)</h4>
        
        <p><strong>Cloro Granulado (${concCloro.toFixed(0)}%):</strong> ${dosisCloroProducto.toFixed(0)} gramos</p>
        <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 10px;">
            *Basado en dosis de 10 ppm (choque) de cloro activo.
        </p>
        
        <p><strong>Sulfato de Aluminio:</strong> ${dosisTotalAluminio.toFixed(0)} gramos</p>
        <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 10px;">
            *Basado en dosis de ${dosisSulfatoAluminio} g/m³ (floculante).
        </p>

        <p><strong>Sulfato de Cobre:</strong> ${dosisTotalCobre.toFixed(1)} gramos</p>
        <p style="font-size: 0.85rem; color: #9ca3af;">
            *Basado en dosis de ${dosisSulfatoCobre} g/m³ (alguicida).
        </p>
    `;
}

// Ejecutar al cargar la página para inicializar los campos correctos
window.onload = function() {
    // Asegura que al cargar se muestren los campos para la forma rectangular por defecto
    cambiarCamposForma();
};