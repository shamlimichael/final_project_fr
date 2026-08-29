const bcrypt = require('bcrypt');
const User = require('../models/user');

const signup_index = (req, res) => { res.render('signup', {err: null}); };

const signup_post = async (req,res) => {
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
        req.session.userId = user._id;
        res.redirect('/');;
    }
    catch (err) {
        console.log('couldent save password', err);
        res.status(500).send('Internal server error');
    }
};

const login_index = (req, res) => { res.render('login', {err: null}); };

const login_post = async (req, res) => {
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
};

const logout_post = (req, res) => { req.session.destroy(() => res.redirect('/login')); }

module.exports = {
    signup_index,
    signup_post,
    login_index,
    login_post,
    logout_post
}