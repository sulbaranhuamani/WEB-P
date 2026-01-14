// Esperamos a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DEL FONDO DINÁMICO ---
    const seccion = document.querySelector('.bg-interactive');
    const tarjetas = document.querySelectorAll('.card');
    let indexActual = 0;
    let intervaloAuto;

    // Función para cambiar fondo
    const cambiarFondo = (url) => {
        if(url) seccion.style.backgroundImage = `url('${url}')`;
    };

    // Cambio automático cada 5 segundos
    const iniciarAuto = () => {
        intervaloAuto = setInterval(() => {
            indexActual = (indexActual + 1) % tarjetas.length;
            const proximaImg = tarjetas[indexActual].getAttribute('data-bg');
            cambiarFondo(proximaImg);
        }, 5000);
    };

    // Eventos de Mouse
    tarjetas.forEach((tarjeta, index) => {
        tarjeta.addEventListener('mouseenter', () => {
            clearInterval(intervaloAuto); // Detiene el auto-cambio
            const img = tarjeta.getAttribute('data-bg');
            cambiarFondo(img);
            indexActual = index;
        });

        tarjeta.addEventListener('mouseleave', () => {
            iniciarAuto(); // Reanuda el auto-cambio
        });
    });

    iniciarAuto(); // Arranca al cargar

    // --- 2. LÓGICA DEL FORMULARIO WHATSAPP ---
    const quoteForm = document.getElementById("quoteForm");
    if(quoteForm) {
        quoteForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let name = document.getElementById("name").value;
            let size = document.getElementById("size").value;
            let location = document.getElementById("location").value;
            let details = document.getElementById("details").value;

            let mensaje = `Hola, soy ${name}. Quiero cotizar una piscina.\n- Tamaño: ${size}\n- Ubicación: ${location}\n- Detalles: ${details}`;
            let url = "https://wa.me/51906892853?text=" + encodeURIComponent(mensaje);
            window.open(url, "_blank");
        });
    }
});

// --- 3. FUNCIONES DE LA CALCULADORA (Fuera del DOMContentLoaded para el onclick) ---
function cambiarCamposForma() {
    const forma = document.getElementById('forma').value;
    document.getElementById('largo').style.display = (forma === 'circular') ? 'none' : 'block';
    document.getElementById('ancho').style.display = (forma === 'circular') ? 'none' : 'block';
    document.getElementById('diametro').style.display = (forma === 'circular') ? 'block' : 'none';
}

function calcularDosis() {
    // Aquí va tu lógica de cálculo de volumen y químicos...
    console.log("Calculando dosis...");
}