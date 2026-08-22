let menuBtn = document.querySelector('.menu_btn');
let sidebar = document.querySelector('.sidebar');
let dashboardMain = document.querySelector('.dashboard_main');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    dashboardMain.classList.toggle('shifted');
});


const searchInput = document.querySelector('.search_input');
const exploreBtn = document.querySelector('.explore_btn');
const exploreCards = document.querySelectorAll('#explore_section .coin_card');
let navButtons = document.querySelectorAll('.sidebar_btn[data-target]');
let allSections = document.querySelectorAll('.dashboard_section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');

        if (targetId !== 'explore_section') {
            searchInput.value = '';
            exploreCards.forEach(card => {
                card.style.display = 'flex';
            });
        }
        navButtons.forEach(b => b.classList.remove('active_btn'));
        btn.classList.add('active_btn');
        allSections.forEach(section => section.classList.add('hidden_section'));
        document.getElementById(targetId).classList.remove('hidden_section');
    });
});

const toggleOptions = document.querySelectorAll('.toggle_opt');
toggleOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        const card = e.target.closest('.stat_card');
        const selectedVal = e.target.getAttribute('data-val'); 
        card.querySelectorAll('.toggle_opt').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        card.querySelectorAll('.pl_stat').forEach(stat => stat.classList.add('hidden_section'));
        card.querySelector(`.pl_stat.${selectedVal}`).classList.remove('hidden_section');
    });
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const exploreSection = document.getElementById('explore_section');
    
    if (exploreSection.classList.contains('hidden_section') && searchTerm.length > 0) {
        exploreBtn.click(); 
    }
    
    exploreCards.forEach(card => {
        const coinName = card.querySelector('.coin_name').textContent.toLowerCase();
        const coinTicker = card.querySelector('.coin_ticker').textContent.toLowerCase();
        
        if (coinName.includes(searchTerm) || coinTicker.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

const removeButtons = document.querySelectorAll('.remove_btn');

removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const row = e.target.closest('.list_row');
        if (row) {
            row.remove();
        }
    });
});

const logoBtn = document.querySelector('.logo');

logoBtn.addEventListener('click', () => {
    exploreBtn.click();
    searchInput.value = '';
    exploreCards.forEach(card => card.style.display = 'flex');
});