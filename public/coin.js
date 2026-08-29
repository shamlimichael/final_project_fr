const logoBtn = document.querySelector('.logo');

logoBtn.addEventListener('click', () => {
    window.location.href = '/';
})

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
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: false,
                grace: '5%'
            }
        }
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
        
        // Background trackers
        short_array.data = data.priceHistory || [];
        mid_array.data = data.priceHistoryTenMin || [];
        long_array.data = data.priceHistoryHour || [];

        let activeDbArray = [];
        if (activeTimeframe === '1m') activeDbArray = short_array.data;
        else if (activeTimeframe === '10m') activeDbArray = mid_array.data;
        else if (activeTimeframe === '1h') activeDbArray = long_array.data;

        const chartData = myChart.data.datasets[0].data;

        if (activeDbArray.length > 0) {
            const newestDbPoint = activeDbArray[activeDbArray.length - 1];
            const newestChartPoint = chartData.length > 0 ? chartData[chartData.length - 1] : null;

            if (newestDbPoint !== newestChartPoint) {
                
                if (chartData.length === activeDbArray.length) {
                    chartData.shift(); 
                    chartData.push(newestDbPoint);
                    
                    for (let i = 0; i < activeDbArray.length; i++) {
                        chartData[i] = activeDbArray[i];
                    }
                } else {
                    chartData.length = 0;
                    chartData.push(...activeDbArray);
                }

                myChart.update();
            }
        }

        const formattedPrice = `$${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        const heroPriceEl = document.querySelector('.coin_hero_price');
        const priceEl = document.querySelector('.coin_price');
        
        if (heroPriceEl) heroPriceEl.innerText = formattedPrice;
        if (priceEl) priceEl.textContent = formattedPrice;

        const changeEl = document.querySelector('.coin_change');
        if (changeEl) {
            changeEl.textContent = (data.change24h > 0 ? '+' : '') + data.change24h + '%';
            changeEl.classList.toggle('text_green', data.change24h >= 0);
            changeEl.classList.toggle('text_red', data.change24h < 0);
        }

    } catch (err) {
        console.error('Failed to poll coin update:', err);
    }
}, 5000);