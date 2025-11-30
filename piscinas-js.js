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
