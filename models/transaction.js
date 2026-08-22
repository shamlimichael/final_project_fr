const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const transactionSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    coinType: { type: mongoose.Schema.Types.ObjectId, ref: 'Coin', required: true }, 
    transactionType: {type: String, enum: ['buy', 'sell']}
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;