const Coin = require('../models/cryptocoin');

const admin_index = async (req, res) => {
    const coins = await Coin.find().sort({ name: 1 });
    res.render('admin', { coins });
};

const coin_create = async (req, res) => {
    try {
        await Coin.create({
            name: req.body.name,
            ticker: req.body.ticker.toUpperCase(),
            price: Number(req.body.price),
            logo: `https://api.dicebear.com/9.x/identicon/svg?seed=${req.body.ticker}`
        });
        res.redirect('/admin');
    } catch (err) {
        res.status(400).send('could not create coin — ticker or name may already exist');
    }
};

const coin_delete = async (req, res) => {
    await Coin.deleteOne({ _id: req.params.id });
    res.redirect('/admin');
};

const coin_update = async (req, res) => {
    try{
        const Newticker = (req.body.ticker || '').trim().toUpperCase().slice(0, 3);
        if (Newticker.length < 3) {
            return res.status(400).send('ticker must be 3 letters');
        }
        await Coin.updateOne({ _id: req.params.id }, { $set: {
            name: req.body.name,
            price: Number(req.body.price),
            ticker: Newticker
        }});
        res.redirect('/admin');
    }
    catch(err){
        if (err.code === 11000) {
            return res.status(400).send('that name or ticker is already taken');
        }
        res.status(400).send('could not update coin');
    }
    
};

module.exports = { 
    admin_index,
    coin_create,
    coin_delete,
    coin_update
};