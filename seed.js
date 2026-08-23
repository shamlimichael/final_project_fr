require('dotenv').config();
const mongoose = require('mongoose');
const Coin = require('./models/cryptocoin');

const coins = [
    { name: "Michis",      ticker: "MCS", price: 2840.75,  change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=MCS" },
    { name: "Tovot",      ticker: "TOV", price: 412.60,   change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=TOV" },
    { name: "Grinvald",   ticker: "GNV", price: 88.30,    change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=GNV" },
    { name: "Etohar",     ticker: "ETH", price: 1975.40,  change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=RTH" },
    { name: "Juvtens",    ticker: "JUV", price: 34.15,    change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=JUV" },
    { name: "Usarov",     ticker: "ROS", price: 7.92,     change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=ROS" },
    { name: "Russi",      ticker: "ROY", price: 0.64,     change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=ROY" },
    { name: "Bictoin",    ticker: "FAK", price: 5120.00,  change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=FAK" },
    { name: "Ofekcohen",  ticker: "DBA", price: 18.45,    change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=DBA" },
    { name: "Cavalirs",   ticker: "CLR", price: 126.80,   change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=CLR" },
    { name: "Circle",     ticker: "CRC", price: 1.02,     change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=CRC" },
    { name: "Moryte",     ticker: "MYT", price: 49.70,    change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=MYT" },
    { name: "Noyona",     ticker: "NNA", price: 0.28,     change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=NNA" },
    { name: "Blacdiam",   ticker: "BLD", price: 763.20,   change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=BLD" },
    { name: "Dangeret",   ticker: "DGE", price: 0.09,     change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=DGE" },
    { name: "Coding",     ticker: "VSC", price: 22.55,    change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=VSC" },
    { name: "Alvgie",     ticker: "ANA", price: 0.41,     change24h: 0, logo: "https://api.dicebear.com/9.x/identicon/svg?seed=ANA" }
];

mongoose.connect(process.env.API_KEY)
    .then(async () => {
        for (const c of coins) {
            await Coin.updateOne(
                { ticker: c.ticker },
                { $setOnInsert: c },
                { upsert: true }
            );
        }
        console.log('seeded', coins.length, 'coins');
        await mongoose.disconnect();
    })
    .catch(err => console.log(err));