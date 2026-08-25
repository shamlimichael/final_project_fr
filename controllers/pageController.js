const Coin = require('../models/cryptocoin');
const Transaction = require('../models/transaction');

let mockTopUsers = [
    { username: "CryptoWhale", balance: 1250450 },
    { username: "DiamondHands", balance: 850200 },
    { username: "SatoshiFan99", balance: 420000 },
    { username: "userTheKing", balance: 10000 },
    { username: "PaperHands", balance: 250 }
];

const main_index = async (req, res) => {
    const coins = await Coin.find();
    const transactions = await Transaction.find({ user: req.user._id }).populate('coinType').sort({ createdAt: -1 });
    res.render('main', {
        user: req.user,
        coins: coins,
        topUsers: mockTopUsers,
        transactions: transactions
    });
};

const prices_get = async (req, res) => {
    const coins = await Coin.find().select('ticker price change24h');
    res.json(coins);
};

module.exports = {
    main_index,
    prices_get
};