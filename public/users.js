const logoBtn = document.querySelector('.logo');

logoBtn.addEventListener('click', () => {
    window.location.href = '/';
})

const form = document.getElementById('user_search_form');
const results = document.getElementById('user_results');
const txFeed = document.getElementById('following_tx_feed');

const runSearch = async () => {
    const params = new URLSearchParams({
        username: document.getElementById('search_username').value,
        min: document.getElementById('search_min').value,
        max: document.getElementById('search_max').value
    });

    try {
        const res = await fetch('/users/search?' + params);
        const users = await res.json();

        results.innerHTML = '';

        if (users.length === 0) {
            results.innerHTML = '<p style="color: white;">No traders found.</p>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('div');
            row.className = 'list_row';
            row.innerHTML = `
                <div class="row_left">
                    <img src="https://ui-avatars.com/api/?name=${user.username}&background=333&color=fff" class="pfp" style="width: 35px; height: 35px;">
                    <span class="coin_name">${user.username}</span>
                    <span style="color: white;">Cash: $${user.balance.toFixed(2)}</span>
                </div>
                <div class="row_center"></div>
                <div class="row_right">
                    <span class="text_green" style="font-size: 18px; font-weight: 800;">$${user.netWorth.toFixed(2)}</span>
                    <button class="follow_btn${user.isFollowing ? ' following' : ''}" data-id="${user._id}">${user.isFollowing ? 'Following' : 'Follow'}</button>
                </div>
            `;
            results.appendChild(row);
        });
    } catch (err) {
        results.innerHTML = '<p style="color: white;">Search failed.</p>';
    }
};

const loadFollowingFeed = async () => {
    try {
        const res = await fetch('/follow/transactions');
        const txs = await res.json();

        if (!res.ok) {
            txFeed.innerHTML = `<p style="color: white;">${txs.error || 'Could not load activity.'}</p>`;
            return;
        }

        txFeed.innerHTML = '';

        if (txs.length === 0) {
            txFeed.innerHTML = '<p style="color: white;">No activity yet.</p>';
            return;
        }

        txs.sort((a, b) => new Date(b.date) - new Date(a.date));

        txs.forEach(tx => {
            const row = document.createElement('div');
            row.className = 'tx_row';
            row.innerHTML = `
                <div class="tx_left">
                    <span class="tx_type ${tx.type === 'buy' ? 'tx_buy' : 'tx_sell'}">${tx.type.toUpperCase()}</span>
                    <div class="tx_details">
                        <span class="tx_name">${tx.username} - ${tx.coinTicker}</span>
                        <span class="tx_date">${new Date(tx.date).toLocaleString()}</span>
                    </div>
                </div>
                <div class="tx_right">
                    <span class="tx_amount">${tx.amount}</span>
                    <span class="tx_total">$${tx.total.toFixed(2)}</span>
                </div>
            `;
            txFeed.appendChild(row);
        });
    } catch (err) {
        console.log('loadFollowingFeed failed', err);
        txFeed.innerHTML = '<p style="color: white;">Could not load activity.</p>';
    }
};

results.addEventListener('click', async (e) => {
    const btn = e.target.closest('.follow_btn');
    if (!btn) return;

    const id = btn.dataset.id;
    const isFollowing = btn.classList.contains('following');

    try {
        const res = await fetch('/follow/' + id, { method: isFollowing ? 'DELETE' : 'POST' });
        if (!res.ok) return;

        btn.classList.toggle('following');
        btn.textContent = btn.classList.contains('following') ? 'Following' : 'Follow';
        loadFollowingFeed();
    } catch (err) {
        console.log('follow toggle failed', err);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch();
});

runSearch();
loadFollowingFeed();