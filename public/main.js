let menuBtn = document.querySelector('.menu_btn');
let sidebar = document.querySelector('.sidebar');
let dashboardMain = document.querySelector('.dashboard_main');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    dashboardMain.classList.toggle('shifted');
});


const searchInput = document.querySelector('.search_input');
const minInput = document.getElementById('min_price');
const maxInput = document.getElementById('max_price');
const exploreBtn = document.querySelector('.explore_btn');
const exploreCards = document.querySelectorAll('#explore_section .coin_card');
let navButtons = document.querySelectorAll('.sidebar_btn[data-target]');
let allSections = document.querySelectorAll('.dashboard_section');

const clearFilters = () => {
    searchInput.value = '';
    minInput.value = '';
    maxInput.value = '';
    exploreCards.forEach(card => {
        card.style.display = 'flex';
    });
};

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');

        if (targetId !== 'explore_section') {
            clearFilters();
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

const filterCoins = () => {
    const term = searchInput.value.toLowerCase().trim();
    const min = Number(minInput.value) || 0;
    const max = Number(maxInput.value) || Infinity;

    const exploreSection = document.getElementById('explore_section');
    if (exploreSection.classList.contains('hidden_section')) exploreBtn.click();

    exploreCards.forEach(card => {
        const name = card.querySelector('.coin_name').textContent.toLowerCase();
        const ticker = card.querySelector('.coin_ticker').textContent.toLowerCase();
        const price = Number(card.querySelector('.coin_price').textContent.replace(/[$,]/g, ''));

        const matchesText = name.includes(term) || ticker.includes(term);
        const matchesPrice = price >= min && price <= max;

        card.style.display = (matchesText && matchesPrice) ? 'flex' : 'none';
    });
};

searchInput.addEventListener('input', filterCoins);
minInput.addEventListener('input', filterCoins);
maxInput.addEventListener('input', filterCoins);

const logoBtn = document.querySelector('.logo');

logoBtn.addEventListener('click', () => {
    exploreBtn.click();
    clearFilters();
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
    document.getElementById('username_form').reset();
    document.getElementById('password_form').reset();
    document.getElementById('delete_form').reset();
    settingsMsg.textContent = '';
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
    if (!confirm('If you give up you are a chud.')) return;
    const res = await fetch('/settings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: document.getElementById('delete_password').value })
    });
    const data = await res.json();
    if (data.error) return showMsg(data.error, true);
    window.location.href = '/login';
});

document.querySelector('.profile_btn').addEventListener('click', () => {
    window.location.href = '/users';
});

document.querySelectorAll('.watch_btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        btn.disabled = true;

        const card = btn.closest('.coin_card');
        const coinId = card.getAttribute('data-id');
        const ticker = card.querySelector('.coin_ticker').textContent;
        const name = card.querySelector('.coin_name').textContent;
        const logo = card.querySelector('.coin_logo').src;
        const price = card.querySelector('.coin_price').textContent;
        const changeEl = card.querySelector('.coin_change');
        const isUp = changeEl.classList.contains('text_green');
        const change = changeEl.textContent.trim();

        try {
            const res = await fetch(`/watchlist/${coinId}`, { method: 'POST' });
            const data = await res.json();
            if (!data.ok) {
                btn.disabled = false;
                return;
            }

            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8 L6.5 12 L13 4" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';

            if (document.querySelector(`.watchlist_list .list_row[data-id="${coinId}"]`)) return;

            const row = document.createElement('div');
            row.className = 'list_row';
            row.setAttribute('data-id', coinId);
            row.innerHTML = `
                <div class="row_left">
                    <img src="${logo}" alt="logo" class="coin_logo">
                    <h3 class="coin_name">${name}</h3>
                    <span class="coin_ticker">${ticker}</span>
                </div>
                <div class="row_center">
                    <span class="coin_price" data-ticker="${ticker}" style="font-size: 18px; font-weight: 700;">${price}</span>
                    <span class="coin_change ${isUp ? 'text_green' : 'text_red'}" data-ticker="${ticker}" style="font-weight: 700;">${change}</span>
                </div>
                <div class="row_right">
                    <a href="/coin/${ticker}" class="trade_btn" style="padding: 8px 15px; font-size: 14px;">Trade</a>
                    <button class="remove_btn" style="padding: 8px 12px; font-size: 14px;">✕</button>
                </div>
            `;
            document.querySelector('.watchlist_list').appendChild(row);
        } catch (err) {
            btn.disabled = false;
            console.log('watchlist add failed', err);
        }
    });
});

document.querySelector('.watchlist_list').addEventListener('click', async (e) => {
    if (!e.target.classList.contains('remove_btn')) return;
    const row = e.target.closest('.list_row');
    const coinId = row.getAttribute('data-id');

    try {
        const res = await fetch(`/watchlist/${coinId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.ok) {
            row.remove();

            const card = document.querySelector(`.coin_card[data-id="${coinId}"]`);
            if (card) {
                const btn = card.querySelector('.watch_btn');
                btn.textContent = '+';
                btn.disabled = false;
            }
        }
    } catch (err) {
        console.log('watchlist remove failed', err);
    }
});

const realMarket = document.getElementById('real_market');

const loadRealPrices = async () => {
    try {
        const res = await fetch('/api/realprices');
        const data = await res.json();
        if (data.error) return;

        realMarket.innerHTML = '';

        Object.keys(data).forEach(id => {
            const coin = data[id];
            const change = coin.usd_24h_change || 0;
            const card = document.createElement('div');
            card.className = 'coin_card';
            card.innerHTML = `
                <div class="coin_header">
                    <h3 class="coin_name">${id.charAt(0).toUpperCase() + id.slice(1)}</h3>
                </div>
                <div class="coin_data">
                    <h2 class="coin_price">$${coin.usd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                    <span class="coin_change ${change >= 0 ? 'text_green' : 'text_red'}">${change > 0 ? '+' : ''}${change.toFixed(2)}%</span>
                </div>
            `;
            realMarket.appendChild(card);
        });
    } catch (err) {
        console.log('real prices failed', err);
    }
};

loadRealPrices();
setInterval(loadRealPrices, 60000);