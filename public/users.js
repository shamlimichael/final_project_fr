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
                </div>
                <div class="row_center">
                    <span style="color: white;">Cash: $${user.balance.toFixed(2)}</span>
                </div>
                <div class="row_right">
                    <span class="text_green" style="font-size: 18px; font-weight: 800;">$${user.netWorth.toFixed(2)}</span>
                </div>
            `;
            results.appendChild(row);
        });
    } catch (err) {
        results.innerHTML = '<p style="color: white;">Search failed.</p>';
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch();
});

runSearch();