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

