const Coin = require('../models/cryptocoin');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const getTopUsers = async () => {
    const users = await User.find().populate('inventory.coin');

    const ranked = users.map(user => {
        let holdingsValue = 0;
        user.inventory.forEach(item => {
            holdingsValue += item.amount * item.coin.price;
        });
        return {
            username: user.username,
            netWorth: user.balance + holdingsValue
        };
    });

    ranked.sort((a, b) => b.netWorth - a.netWorth);
    return ranked.slice(0, 10);
};

const main_index = async (req, res) => {
    const coins = await Coin.find();
    const transactions = await Transaction.find({ user: req.user._id }).populate('coinType').sort({ createdAt: -1 });
    res.render('main', {
        user: req.user,
        coins: coins,
        topUsers: await getTopUsers(),
        transactions: transactions
    });
};

const prices_get = async (req, res) => {
    const coins = await Coin.find().select('ticker price change24h');
    res.json(coins);
};

const coin_get = async (req, res) => {
    try {
        const coin = await Coin.findOne({ ticker: req.params.ticker.toUpperCase() });
        if (!coin) return res.status(404).json({ error: 'Coin not found' });

        res.json({
            price: coin.price,
            change24h: coin.change24h,
            priceHistory: [...coin.priceHistory, coin.price],
            priceHistoryTenMin: [...coin.priceHistoryTenMin, coin.price],
            priceHistoryHour: [...coin.priceHistoryHour, coin.price]
        });
    } catch (err) {
        console.log('error fetching coin api', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const about_index = (req, res) => { res.render('about'); };

const coin_index = async (req, res) => {
    try {
        const coin = await Coin.findOne({ ticker: req.params.ticker.toUpperCase() });
        if (!coin) return res.status(404).send('Coin not found');

        res.render('coin', {
            user: req.user,
            coin,
            priceHistory:       [...coin.priceHistory,       coin.price],
            priceHistoryTenMin: [...coin.priceHistoryTenMin, coin.price],
            priceHistoryHour:   [...coin.priceHistoryHour,   coin.price],
        });
    } catch (err) {
        console.log('error loading coin page', err);
        res.status(500).send('Internal server error');
    }
};


const trade_post = async (req, res) => {
    try {
        const { ticker, amount, type } = req.body;
 
        if (!ticker || !amount || !type || amount <= 0) {
            return res.status(400).json({ error: 'Invalid trade parameters' });
        }
 
        const coin = await Coin.findOne({ ticker: ticker.toUpperCase() });
        if (!coin) return res.status(404).json({ error: 'Coin not found' });
 
        const user = await User.findById(req.user._id).populate('inventory.coin');
        const totalCost = amount * coin.price;
 
        if (type === 'buy') {
            if (user.balance < totalCost) {
                return res.json({ error: 'Insufficient funds' });
            }
 
            user.balance = Number((user.balance - totalCost).toFixed(2));
 
            const existingItem = user.inventory.find(item => item.coin._id.equals(coin._id));
            if (existingItem) {
                const newTotal = existingItem.amount + amount;
                existingItem.avgBuyPrice = ((existingItem.avgBuyPrice * existingItem.amount) + totalCost) / newTotal;
                existingItem.amount = newTotal;
            } else {
                user.inventory.push({ coin: coin._id, amount, avgBuyPrice: coin.price });
            }
 
            await user.save();
 
            await Transaction.create({
                user: user._id,
                amount,
                price: coin.price,
                coinType: coin._id,
                transactionType: 'buy'
            });
 
            const updatedItem = user.inventory.find(item => item.coin._id.equals(coin._id));
            return res.json({ newOwned: updatedItem.amount, newBalance: user.balance });
        }
 
        if (type === 'sell') {
            const existingItem = user.inventory.find(item => item.coin._id.equals(coin._id));
 
            if (!existingItem || existingItem.amount < amount) {
                return res.json({ error: 'Insufficient coins' });
            }
 
            user.balance = Number((user.balance + totalCost).toFixed(2));
            existingItem.amount -= amount;
 
            if (existingItem.amount === 0) {
                user.inventory = user.inventory.filter(item => !item.coin._id.equals(coin._id));
            }
 
            await user.save();
 
            await Transaction.create({
                user: user._id,
                amount,
                price: coin.price,
                coinType: coin._id,
                transactionType: 'sell'
            });
 
            const updatedItem = user.inventory.find(item => item.coin._id.equals(coin._id));
            return res.json({ newOwned: updatedItem ? updatedItem.amount : 0, newBalance: user.balance });
        }
 
        return res.status(400).json({ error: 'Invalid trade type' });
 
    } catch (err) {
        console.log('trade error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
 


module.exports = {
    main_index,
    prices_get,
    coin_get,
    about_index,
    coin_index,
    trade_post
};