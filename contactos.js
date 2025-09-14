// Validación simple + envío con fetch (Formspree) + toast
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');


function showToast(msg){
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => (toast.hidden = true), 3000);
}


function setError(el, msg){
    const err = el.closest('.field').querySelector('.error');
    err.textContent = msg || '';
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();


    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    const email = (fd.get('email') || '').trim();
    const message = (fd.get('message') || '').trim();


    let valid = true;
    if(!name){ setError(form.elements.name, 'Escribe tu nombre'); valid = false; } else setError(form.elements.name, '');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError(form.elements.email, 'Email no válido'); valid = false; } else setError(form.elements.email, '');
    if(message.length < 8){ setError(form.elements.message, 'Cuéntame un poco más'); valid = false; } else setError(form.elements.message, '');


    if(!valid) return;


// Deshabilitar mientras envía
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Enviando…';


    try{
// Si usas Formspree: reemplaza TU_ENDPOINT en el HTML
        const endpoint = form.getAttribute('action');
        if(endpoint && endpoint.startsWith('https://formspree.io/')){
            const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' }});
            if(res.ok){
                form.reset();
                showToast('¡Mensaje enviado, gracias!');
            }else{
                showToast('No se pudo enviar. Intenta de nuevo.');
            }
        } else {
// Fallback: mailto (deja que el navegador maneje el envío)
            window.location.href = `mailto:tu-correo@dominio.com?subject=Contacto%20desde%20la%20web&body=${encodeURIComponent(message)}%0A%0ANombre:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}`;
        }
    }catch(err){
        console.error(err);
        showToast('Error de red. Revisa tu conexión.');
    }finally{
        btn.disabled = false; btn.textContent = 'Enviar';
    }
});


// Limpia mensajes de error cuando el usuario escribe
['name','email','message'].forEach((n)=>{
    form.elements[n].addEventListener('input', ()=> setError(form.elements[n], ''));
});