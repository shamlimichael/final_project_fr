const bcrypt = require('bcrypt');
const User = require('../models/user');
const Transaction = require('../models/transaction');

const username_post = async (req, res) => {
    try {
        const newName = (req.body.username || '').trim();
        if (newName.length < 3 || newName.includes('@')) {
            return res.json({ error: 'invalid username' });
        }
        const taken = await User.findOne({ username: newName, _id: { $ne: req.user._id } });
        if (taken) {
            return res.json({ error: 'username already in use' });
        }
        await User.updateOne({ _id: req.user._id }, { $set: { username: newName } });
        res.json({ username: newName });
    } catch (err) {
        console.log('username change failed', err);
        res.status(500).json({ error: 'server error' });
    }
};

const password_post = async (req, res) => {
    try {
        const curPW = req.body.currentPassword || '';
        const newPW = req.body.newPassword || '';

        if (newPW.length < 6 || (!newPW.includes("!") && !newPW.includes("@"))) {
            return res.json({ error: 'password must be 6+ characters and include ! or @' });
        }

        const match = await bcrypt.compare(curPW, req.user.password);
        if (!match) {
            return res.json({ error: 'current password is incorrect' });
        }

        const salt = await bcrypt.genSalt();
        const hashPW = await bcrypt.hash(newPW, salt);
        await User.updateOne({ _id: req.user._id }, { $set: { password: hashPW } });

        res.json({ ok: true });
    } catch (err) {
        console.log('password change failed', err);
        res.status(500).json({ error: 'server error' });
    }
};

const delete_post = async (req, res) => {
    try {
        const password = req.body.password || '';
        const match = await bcrypt.compare(password, req.user.password);
        if (!match) {
            return res.json({ error: 'password is incorrect' });
        }
        await Transaction.deleteMany({ user: req.user._id });
        await User.deleteOne({ _id: req.user._id });
        req.session.destroy(() => res.json({ ok: true }));
    } catch (err) {
        console.log('delete failed', err);
        res.status(500).json({ error: 'server error' });
    }
};

const search_users = async (req, res) => {
    try {
        const name = (req.query.username || '').trim();
        const min = Number(req.query.min) || 0;
        const max = Number(req.query.max) || Infinity;

        const filter = {};
        if (name) filter.username = { $regex: name, $options: 'i' };

        const users = await User.find(filter).populate('inventory.coin');

        const results = users.map(user => {
            let holdingsValue = 0;
            user.inventory.forEach(item => {
                holdingsValue += item.amount * item.coin.price;
            });
            return {
                username: user.username,
                balance: user.balance,
                netWorth: user.balance + holdingsValue
            };
        }).filter(u => u.netWorth >= min && u.netWorth <= max);

        res.json(results);
    } catch (err) {
        console.log('user search failed', err);
        res.status(500).json({ error: 'server error' });
    }
};

const users_index = (req, res) => { res.render('users', {account: req.user}); };

const watchlist_add = async (req, res) => {
    try {
        await User.updateOne(
            { _id: req.user._id },
            { $addToSet: { watchlist: req.params.id } }
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'server error' });
    }
};

const watchlist_remove = async (req, res) => {
    try {
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { watchlist: req.params.id } }
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'server error' });
    }
};

module.exports = {
    username_post,
    password_post,
    delete_post,
    search_users,
    users_index,
    watchlist_add,
    watchlist_remove
};