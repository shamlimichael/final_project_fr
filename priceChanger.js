const Coin = require('./models/cryptocoin');

const limitArray = 100;
const minprice = 0.01;
const secsbetween = 5000;

const tick = async () => {
    try {
        const coinIds = await Coin.find().select('_id');
        for (const { _id } of coinIds) {
            const coin = await Coin.findById(_id);
            if (!coin) continue;

            const drift = (Math.random() - 0.5) * 0.04;
            const newPrice = Math.max(coin.price * (1 + drift), minprice);
            const newChange = Number((((newPrice - coin.price) / coin.price) * 100 + coin.change24h * 0.9).toFixed(2));

            await Coin.updateOne(
                { _id: coin._id },
                {
                    $set: { price: Number(newPrice.toFixed(6)), change24h: newChange },
                    $push: { priceHistory: { $each: [coin.price], $slice: -limitArray } }
                }
            );
        }
    } catch (err) {
        console.log('price tick failed', err);
    }
};

const start = () => setInterval(tick, secsbetween);

module.exports = { start };