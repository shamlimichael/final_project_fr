const logoBtn = document.querySelector('.logo');
logoBtn.addEventListener('click', () => { window.location.href = '/'; });

const short_array = {
    labels: ['-60s', '-55s', '-50s', '-45s', '-40s', '-35s', '-30s', '-25s', '-20s', '-15s', '-10s', '-5s', '0s'],
    data: typeof PRICE_HISTORY !== 'undefined' ? PRICE_HISTORY : []
};
const mid_array = {
    labels: ['-10m', '-9m', '-8m', '-7m', '-6m', '-5m', '-4m', '-3m', '-2m', '-1m', '0m'],
    data: typeof PRICE_HISTORY_10M !== 'undefined' ? PRICE_HISTORY_10M : []
};
const long_array = {
    labels: ['-1h', '-55m', '-50m', '-45m', '-40m', '-35m', '-30m', '-25m', '-20m', '-15m', '-10m', '-5m', '0m'],
    data: typeof PRICE_HISTORY_1H !== 'undefined' ? PRICE_HISTORY_1H : []
};

let activeTimeframe = '1m';
let currentPrice = typeof COIN_PRICE !== 'undefined' ? COIN_PRICE : 0;
let previousPrice = currentPrice;
let currentBalance = typeof USER_BALANCE !== 'undefined' ? USER_BALANCE : 0;

const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Chartc = document.getElementById('coinChart').getContext('2d');
const myChart = new Chart(Chartc, {
    type: 'line',
    data: {
        labels: [...short_array.labels],
        datasets: [{
            label: 'Price',
            data: [...short_array.data],
            borderColor: 'rgb(255, 255, 255)',
            backgroundColor: 'rgb(32, 32, 32)',
            fill: true,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'linear' },
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false, grace: '5%' } }
    }
});

document.querySelectorAll('.tf_btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.tf_btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        activeTimeframe = e.target.getAttribute('data-tf');

        const chartLabels = myChart.data.labels;
        const chartData = myChart.data.datasets[0].data;
        chartLabels.length = 0;
        chartData.length = 0;

        if (activeTimeframe === '1m') {
            chartLabels.push(...short_array.labels);
            chartData.push(...short_array.data);
        } else if (activeTimeframe === '10m') {
            chartLabels.push(...mid_array.labels);
            chartData.push(...mid_array.data);
        } else if (activeTimeframe === '1h') {
            chartLabels.push(...long_array.labels);
            chartData.push(...long_array.data);
        }

        myChart.update('none');
    });
});

setInterval(async () => {
    try {
        const ticker = typeof COIN_TICKER !== 'undefined' ? COIN_TICKER : window.location.pathname.split('/').pop();
        const response = await fetch(`/api/coin/${ticker}`);
        if (!response.ok) return;

        const data = await response.json();
        previousPrice = currentPrice;
        currentPrice = data.price;

        short_array.data = data.priceHistory || [];
        mid_array.data = data.priceHistoryTenMin || [];
        long_array.data = data.priceHistoryHour || [];

        const chartData = myChart.data.datasets[0].data;

        if (activeTimeframe === '1m') {
            const newestPoint = short_array.data[short_array.data.length - 1];
            if (newestPoint !== chartData[chartData.length - 1]) {
                chartData.shift();
                chartData.push(newestPoint);
                myChart.update();
            }
        } else {
            const activeDbArray = activeTimeframe === '10m' ? mid_array.data : long_array.data;
            if (activeDbArray.length > 0 && activeDbArray[activeDbArray.length - 1] !== chartData[chartData.length - 1]) {
                chartData.length = 0;
                chartData.push(...activeDbArray);
                myChart.update('none');
            }
        }

        const tickChange = previousPrice > 0 ? ((currentPrice - previousPrice) / previousPrice * 100) : 0;
        const topChangeEl = document.querySelector('.coin_change');
        if (topChangeEl) {
            topChangeEl.textContent = (tickChange >= 0 ? '+' : '') + tickChange.toFixed(3) + '%';
            topChangeEl.classList.toggle('text_green', tickChange >= 0);
            topChangeEl.classList.toggle('text_red', tickChange < 0);
        }

        const oneMinPrice = short_array.data.length > 0 ? short_array.data[0] : currentPrice;
        const oneMinChange = oneMinPrice > 0 ? ((currentPrice - oneMinPrice) / oneMinPrice * 100) : 0;
        const oneMinEl = document.getElementById('stat_1min_change');
        if (oneMinEl) {
            oneMinEl.textContent = (oneMinChange >= 0 ? '+' : '') + oneMinChange.toFixed(2) + '%';
            oneMinEl.className = 'stat_row_value ' + (oneMinChange >= 0 ? 'text_green' : 'text_red');
        }

        const statPriceEl = document.getElementById('stat_current_price');
        if (statPriceEl) statPriceEl.textContent = fmt(currentPrice);

        const heroPriceEl = document.querySelector('.coin_price');
        if (heroPriceEl) heroPriceEl.textContent = fmt(currentPrice);

        const amountVal = parseFloat(amountInput.value);
        if (amountVal > 0) {
            tradeValue.textContent = fmt(amountVal * currentPrice);
        }

    } catch (err) {
        console.error('Failed to poll coin update:', err);
    }
}, 5000);

const amountInput = document.querySelector('.amount_input');
const tradeValue = document.getElementById('trade_value');

amountInput.addEventListener('input', () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        tradeValue.textContent = '----';
        tradeValue.style.color = 'rgb(160, 160, 160)';
        return;
    }
    tradeValue.textContent = fmt(amount * currentPrice);
    tradeValue.style.color = 'rgb(76, 160, 128)';
});

const showHoverBalance = (type) => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return;
    const cost = amount * currentPrice;
    if (type === 'buy') {
        const result = currentBalance - cost;
        tradeValue.textContent = `${fmt(currentBalance)} - ${fmt(cost)} = ${fmt(result)}`;
        tradeValue.style.color = result >= 0 ? 'rgb(76, 160, 128)' : 'rgb(220, 53, 69)';
    } else {
        const result = currentBalance + cost;
        tradeValue.textContent = `${fmt(currentBalance)} + ${fmt(cost)} = ${fmt(result)}`;
        tradeValue.style.color = 'rgb(76, 160, 128)';
    }
};

const restoreTradeValue = () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        tradeValue.textContent = '----';
        tradeValue.style.color = 'rgb(160, 160, 160)';
    } else {
        tradeValue.textContent = fmt(amount * currentPrice);
        tradeValue.style.color = 'rgb(76, 160, 128)';
    }
};

const buyBtn = document.getElementById('buy');
const sellBtn = document.getElementById('sell');

buyBtn.addEventListener('mouseenter', () => showHoverBalance('buy'));
buyBtn.addEventListener('mouseleave', restoreTradeValue);
sellBtn.addEventListener('mouseenter', () => showHoverBalance('sell'));
sellBtn.addEventListener('mouseleave', restoreTradeValue);

const updateUI = (data) => {
    currentBalance = data.newBalance;
    document.getElementById('owned_amount').textContent = data.newOwned + ' ' + COIN_TICKER;
    const balanceEl = document.querySelector('.balance_label');
    if (balanceEl) balanceEl.textContent = 'Balance: ' + fmt(data.newBalance);
    amountInput.value = '';
    tradeValue.textContent = '----';
    tradeValue.style.color = 'rgb(160, 160, 160)';
};

buyBtn.addEventListener('click', async () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return;
    const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: COIN_TICKER, amount, type: 'buy' })
    });
    const data = await res.json();
    if (data.error) {
        tradeValue.textContent = data.error;
        tradeValue.style.color = 'rgb(220, 53, 69)';
    } else {
        updateUI(data);
    }
});

sellBtn.addEventListener('click', async () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return;
    const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: COIN_TICKER, amount, type: 'sell' })
    });
    const data = await res.json();
    if (data.error) {
        tradeValue.textContent = data.error;
        tradeValue.style.color = 'rgb(220, 53, 69)';
    } else {
        updateUI(data);
    }
});