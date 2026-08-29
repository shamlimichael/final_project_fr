const Coin = require('./models/cryptocoin');

const limitArray = 12;
const limitTenMin = 10;
const limitHour = 12;
const minprice = 0.01;
const secsbetween = 5000;
const rawToTenMin = 12;
const tenMinToHour = 5;
const buffers = {}; 

const tick = async () => {
    try {
        const coins = await Coin.find();
        for (const coin of coins) {
            const id = coin._id.toString();
            
            if (!buffers[id]) buffers[id] = { minuteBuffer: [], tenMinBuffer: [] };

            const drift = (Math.random() - 0.5) * 0.04;
            const newPrice = Math.max(coin.price * (1 + drift), minprice);
            const newChange = Number((((newPrice - coin.price) / coin.price) * 100 + coin.change24h * 0.9).toFixed(2));

            buffers[id].minuteBuffer.push(newPrice);

            const update = {
                $set: { price: Number(newPrice.toFixed(6)), change24h: newChange },
                $push: { priceHistory: { $each: [Number(newPrice.toFixed(6))], $slice: -limitArray } }
            };

            if (buffers[id].minuteBuffer.length === rawToTenMin) {
                
                const avg10m = buffers[id].minuteBuffer.reduce((a, b) => a + b, 0) / rawToTenMin;
                
                update.$push.priceHistoryTenMin = {
                    $each: [Number(avg10m.toFixed(6))],
                    $slice: -limitTenMin
                };

                buffers[id].tenMinBuffer.push(avg10m);
                
                buffers[id].minuteBuffer = [];

                if (buffers[id].tenMinBuffer.length === tenMinToHour) {
                    
                    const avg1h = buffers[id].tenMinBuffer.reduce((a, b) => a + b, 0) / tenMinToHour;
                    
                    update.$push.priceHistoryHour = {
                        $each: [Number(avg1h.toFixed(6))],
                        $slice: -limitHour
                    };
                    
                    buffers[id].tenMinBuffer = [];
                }
            }

            await Coin.updateOne({ _id: coin._id }, update);
        }
    } catch (err) {
        console.log('price tick failed', err);
    }
};

const start = () => {
    tick();
    setInterval(tick, secsbetween);
};

module.exports = { start };