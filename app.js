const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoutes');
const priceChanger = require('./priceChanger');

const app = express();

mongoose.connect(process.env.API_KEY)
    .then((result) => {
        app.listen(3000);
        priceChanger.start();
    })
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

app.use(authRoutes);

app.use(requireAuth, pageRoutes);

app.use(userRoutes);

