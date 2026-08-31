const logoBtn = document.querySelector('.logo');

logoBtn.addEventListener('click', () => {
    window.location.href = '/';
})

const form = document.getElementById('user_search_form');
const results = document.getElementById('user_results');

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
                <div class="row_center">
                    <span class="text_green" style="font-size: 18px; font-weight: 800;">$${user.netWorth.toFixed(2)}</span>
                </div>
                <div class="row_right">
                    <button class="follow_btn${user.isFollowing ? ' following' : ''}" data-id="${user._id}">${user.isFollowing ? 'Following' : 'Follow'}</button>
                </div>
            `;
            results.appendChild(row);
        });
    } catch (err) {
        results.innerHTML = '<p style="color: white;">Search failed.</p>';
    }
};

results.addEventListener('click', async (e) => {
    const btn = e.target.closest('.follow_btn');
    if (!btn) return;

    const id = btn.dataset.id;
    const isFollowing = btn.classList.contains('following');

    try {
        const res = await fetch('/follow/' + id, { method: isFollowing ? 'DELETE' : 'POST' });
        const data = await res.json();
        if (data.error) return;

        if (isFollowing) {
            btn.classList.remove('following');
            btn.textContent = 'Follow';
        } else {
            btn.classList.add('following');
            btn.textContent = 'Following';
        }
    } catch (err) {
        console.log('follow toggle failed', err);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch();
});

runSearch();