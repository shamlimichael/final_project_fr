const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Coin = require('./models/cryptocoin');

const app = express();


mongoose.connect(process.env.API_KEY)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let coin1 = new Coin({ name: "Ethereum", ticker: "ETH", price: 3400.50, change24h: 2.4, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin2 = new Coin({ name: "Solana", ticker: "SOL", price: 145.20, change24h: -1.2, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin3 = new Coin({ name: "Ripple", ticker: "XRP", price: 0.58, change24h: 0.5, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin4 = new Coin({ name: "Cardano", ticker: "ADA", price: 0.45, change24h: -3.1, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin5 = new Coin({ name: "Avalanche", ticker: "AVAX", price: 35.10, change24h: 4.2, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin6 = new Coin({ name: "Polkadot", ticker: "DOT", price: 7.20, change24h: 1.1, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin7 = new Coin({ name: "Chainlink", ticker: "LINK", price: 18.30, change24h: 5.5, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin8 = new Coin({ name: "Polygon", ticker: "MATIC", price: 0.72, change24h: -0.8, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin9 = new Coin({ name: "Dogecoin", ticker: "DOGE", price: 0.16, change24h: 8.9, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin10 = new Coin({ name: "Shiba Inu", ticker: "SHIB", price: 0.00002, change24h: -4.5, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin11 = new Coin({ name: "Litecoin", ticker: "LTC", price: 82.40, change24h: 0.2, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin12 = new Coin({ name: "Uniswap", ticker: "UNI", price: 10.50, change24h: 3.8, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin13 = new Coin({ name: "Cosmos", ticker: "ATOM", price: 8.90, change24h: -1.5, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin14 = new Coin({ name: "Monero", ticker: "XMR", price: 130.00, change24h: 1.8, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });
let coin15 = new Coin({ name: "Stellar", ticker: "XLM", price: 0.11, change24h: -0.4, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" });


let usertest = new User({
    email: "user@gmail.com",
    username: "userTheKing",
    password: "Pa55w0rd!",
    balance: 10000,
    inventory: [
        { coin: coin1, amount: 2.5, avgBuyPrice: 5000 },
        { coin: coin2, amount: 45, avgBuyPrice: 120.50 },
        { coin: coin7, amount: 150, avgBuyPrice: 14.20 },
        { coin: coin12, amount: 85, avgBuyPrice: 8.90 }
    ],
    watchlist: [coin3, coin5, coin9, coin13] 
});

let mockTopUsers = [
    { username: "CryptoWhale", balance: 1250450 },
    { username: "DiamondHands", balance: 850200 },
    { username: "SatoshiFan99", balance: 420000 },
    { username: "userTheKing", balance: 10000 },
    { username: "PaperHands", balance: 250 }
];

app.get('/', (req, res) => {
    res.render('main', {
        user: usertest,
        coins: [
        coin1, coin2, coin3, coin4, coin5, coin6, coin7, coin8, coin9, coin10,
        coin11, coin12, coin13, coin14, coin15
    ], topUsers: mockTopUsers
    });
});

app.get('/login', (req, res) => {
    res.render('login', {err: null});
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/signup', (req, res) => {
    res.render('signup', {err: null});
});

app.post('/signup', async (req,res) => {
    try{
        let userCheck = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });
        if (userCheck){
             return res.render('signup', {err: "username or email already in use!"});
        }
        const salt = await bcrypt.genSalt();
        const hashPW = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPW;
        const user = new User(req.body);
        await user.save();
        res.redirect('/login');
    }
    catch (err) {
        console.log('couldent save password', err);
        res.status(500).send('Internal server error');
    }
});

app.post('/login', async (req, res) => {
    try{
        let user = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        });
        if (!user){
            return res.render('login', {err: "username or email couldnt be found."});
        }
        if (await bcrypt.compare(req.body.password, user.password)){
            res.redirect('/');
        }else{
            return res.render('login', {err: "incorrect password!"});
        }
    }catch(err) {
        console.log('couldent login', err);
        res.status(500).send('Internal server error');
    }
});
