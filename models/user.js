const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    balance: {type: Number, required: true, default: 1000},
    inventory: [{
        coin: {type: mongoose.Schema.Types.ObjectId, ref: 'Coin', required: true},
        amount: {type: Number,required: true},
        avgBuyPrice: {type: Number}
    }]      
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;
