// Filtro por chips y búsqueda simple
const chips = document.querySelectorAll('.chip');
const search = document.getElementById('search');
const cards = document.querySelectorAll('.project');

function applyFilters(){
    const active = document.querySelector('.chip.active').dataset.filter;
    const q = (search.value || '').toLowerCase();

    cards.forEach(card => {
        const cats = card.dataset.cats.split(',');
        const matchCat = active === 'all' || cats.includes(active);

        const text = `${card.querySelector('.title').textContent} ${card.querySelector('.desc').textContent} ${card.dataset.tags}`.toLowerCase();
        const matchText = !q || text.includes(q);

        card.style.display = (matchCat && matchText) ? '' : 'none';
    });
}

chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    ch.classList.add('active');
    applyFilters();
}));

search.addEventListener('input', applyFilters);

// Inicial
applyFilters();