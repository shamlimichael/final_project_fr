const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const User = require('./models/user');
const Coin = require('./models/cryptocoin');
const Transaction = require('./models/transaction');

const app = express();


mongoose.connect(process.env.API_KEY)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.API_KEY })
}));

const requireAuth = async (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    req.user = await User.findById(req.session.userId).populate('inventory.coin watchlist');
    if (!req.user) {
        req.session.destroy();
        return res.redirect('/login');
    }
    next();
};

let mockTopUsers = [
    { username: "CryptoWhale", balance: 1250450 },
    { username: "DiamondHands", balance: 850200 },
    { username: "SatoshiFan99", balance: 420000 },
    { username: "userTheKing", balance: 10000 },
    { username: "PaperHands", balance: 250 }
];

app.get('/', requireAuth, async (req, res) => {
    const coins = await Coin.find();
    const transactions = await Transaction.find({ user: req.user._id }).populate('coinType').sort({ createdAt: -1 });
    res.render('main', {
        user: req.user,
        coins: coins,
        topUsers: mockTopUsers,
        transactions: transactions
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
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashPW,
            balance: 1000
        });
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
            req.session.userId = user._id;
            res.redirect('/');
        }else{
            return res.render('login', {err: "incorrect password!"});
        }
    }catch(err) {
        console.log('couldent login', err);
        res.status(500).send('Internal server error');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

