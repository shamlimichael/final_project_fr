const Coin = require('./models/cryptocoin');

const limitArray = 100;
const minprice = 0.01;
const secsbetween = 5000;

const tick = async () => {
    try {
        const coins = await Coin.find();
        for (const coin of coins) {
            const drift = (Math.random() - 0.5) * 0.04;//the drift is equal to a number bettween -0.2 to 0.2
            const newPrice = Math.max(coin.price * (1 + drift), minprice);

            coin.priceHistory.push(coin.price);
            if (coin.priceHistory.length > limitArray) {
                coin.priceHistory.shift();
            }

            coin.change24h = Number((((newPrice - coin.price) / coin.price) * 100 + coin.change24h * 0.9).toFixed(2));
            coin.price = Number(newPrice.toFixed(6));
            await coin.save();
        }
    } catch (err) {
        console.log('price tick failed', err);
    }
};

const start = () => setInterval(tick, secsbetween);

module.exports = { start };