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

const about_index = (req, res) => { res.render('about'); };

module.exports = {
    main_index,
    prices_get,
    about_index
};