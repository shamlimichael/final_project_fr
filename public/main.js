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

const refreshPrices = async () => {
    const res = await fetch('/api/prices');
    const coins = await res.json();

    coins.forEach(coin => {
        document.querySelectorAll(`.coin_price[data-ticker="${coin.ticker}"]`).forEach(el => {
            el.textContent = '$' + coin.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        });
        document.querySelectorAll(`.coin_change[data-ticker="${coin.ticker}"]`).forEach(el => {
            el.textContent = (coin.change24h > 0 ? '+' : '') + coin.change24h + '%';
            el.classList.toggle('text_green', coin.change24h >= 0);
            el.classList.toggle('text_red', coin.change24h < 0);
        });
    });
};

setInterval(refreshPrices, 5000);

const settingsBtn = document.querySelector('.settings_btn');
const settingsModal = document.getElementById('settings_modal');
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden_section');
});
document.querySelector('.close_modal').addEventListener('click', () => {
    settingsModal.classList.add('hidden_section');
    document.querySelector('#new_username').value = '';
    document.querySelector('#current_password').value = '';
    document.querySelector('#new_password').value = '';
    document.querySelector('#delete_password').value = '';
});

const settingsMsg = document.getElementById('settings_msg');

const showMsg = (text, isError) => {
    settingsMsg.textContent = text;
    settingsMsg.classList.toggle('text_red', isError);
    settingsMsg.classList.toggle('text_green', !isError);
};

document.getElementById('username_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/settings/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: document.getElementById('new_username').value })
    });
    const data = await res.json();
    if (data.error) return showMsg(data.error, true);
    showMsg('username updated', false);
    document.querySelector('.pfp').src = `https://ui-avatars.com/api/?name=${data.username}&background=333&color=fff`;
});

document.getElementById('password_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentPassword: document.getElementById('current_password').value,
            newPassword: document.getElementById('new_password').value
        })
    });
    const data = await res.json();
    if (data.error) return showMsg(data.error, true);
    showMsg('password updated', false);
    document.getElementById('password_form').reset();
});

document.getElementById('delete_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!confirm('Delete your account permanently? This cannot be undone.')) return;
    const res = await fetch('/settings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: document.getElementById('delete_password').value })
    });
    const data = await res.json();
    if (data.error) return showMsg(data.error, true);
    window.location.href = '/login';
});