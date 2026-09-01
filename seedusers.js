require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Coin = require('./models/cryptocoin');
const Transaction = require('./models/transaction');

const startbalance = 10000;
const demopassword = '123456!';

const people = [
    { username: 'admin',    email: 'admin@gmail.com',  role: 'admin' },
    { username: 'noa levi',   email: 'noa@gmail.com',      role: 'user' },
    { username: 'daniel k',   email: 'daniel@gmail.com',   role: 'user' },
    { username: 'yarden b',   email: 'yarden@gmail.com',   role: 'user' },
    { username: 'omer shani', email: 'omer@gmail.com',     role: 'user' },
    { username: 'tamar gold', email: 'tamar@gmail.com',    role: 'user' },
    { username: 'eitan m',    email: 'eitan@gmail.com',    role: 'user' },
    { username: 'shira avni', email: 'shira@gmail.com',    role: 'user' },
    { username: 'roi peretz', email: 'roi@gmail.com',      role: 'user' },
    { username: 'maya dror',  email: 'maya@gmail.com',     role: 'user' }
];

mongoose.connect(process.env.API_KEY)
    .then(async () => {
        const coins = await Coin.find();
        if (coins.length === 0) {
            console.log('no coins in the database, run seed.js first');
            await mongoose.disconnect();
            return;
        }

        await Transaction.deleteMany({});
        await User.deleteMany({});
        console.log('deleted old users and transactions');

        const salt = await bcrypt.genSalt();
        const hashPW = await bcrypt.hash(demopassword, salt);
        const users = [];

        for (let i = 0; i < people.length; i++) {
            const user = new User({
                email: people[i].email,
                username: people[i].username,
                password: hashPW,
                balance: startbalance,
                role: people[i].role
            });

            let balance = startbalance;
            const howmany = 3 + (i % 3);

            for (let j = 0; j < howmany; j++) {
                const coin = coins[(i + j * 3) % coins.length];
                const price = Number((coin.price * (0.85 + Math.random() * 0.3)).toFixed(6));
                const amount = Number(((balance * 0.15) / price).toFixed(4));
                const cost = amount * price;

                if (cost > balance) continue;
                balance = balance - cost;

                user.inventory.push({ coin: coin._id, amount: amount, avgBuyPrice: price });

                await Transaction.create({
                    user: user._id,
                    amount: amount,
                    price: price,
                    coinType: coin._id,
                    transactionType: 'buy'
                });
            }

            for (let j = 0; j < 3; j++) {
                user.watchlist.push(coins[(i + j) % coins.length]._id);
            }

            user.balance = Number(balance.toFixed(2));
            await user.save();
            users.push(user);
        }

        for (let i = 0; i < users.length; i++) {
            users[i].follow.push(users[(i + 1) % users.length]._id);
            users[i].follow.push(users[(i + 2) % users.length]._id);
            await users[i].save();
        }

        const count = await Transaction.countDocuments();
        console.log('seeded', users.length, 'users and', count, 'transactions');
        console.log('login with', people[0].username, '/', demopassword);
        await mongoose.disconnect();
    })
    .catch(err => console.log(err));