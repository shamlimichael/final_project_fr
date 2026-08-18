const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();


mongoose.connect(process.env.API_KEY)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded())

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

app.post('/', (req,res) => {
    const user = new User(req.body);

    user.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
});
