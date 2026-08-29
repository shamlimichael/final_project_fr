const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    name: { type: String, required: true, unique: true },
    ticker: { type: String, required: true, unique: true },
    logo: { type: String },
    price: { type: Number, required: true },
    change24h: { type: Number, default: 0 },
    priceHistory: { type: [Number], default: [] },
    priceHistoryTenMin: { type: [Number], default: [] },
    priceHistoryHour: { type: [Number], default: [] }
}, { timestamps: true });

const Coin = mongoose.model('Coin', coinSchema);
module.exports = Coin;