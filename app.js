const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const app = express();


mongoose.connect(process.env.API_KEY)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req,res) => {
    try{
        const salt = await bcrypt.genSalt();
        const hashPW = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPW;
        const user = new User(req.body);
        await user.save();
        res.redirect('/login');
    }
    catch (err) {
        console.log('couldent save password', err);
    }
});
