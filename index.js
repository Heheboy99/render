const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is Alive!'));
app.listen(3000); // Render ko khush rakhne ke liye port

const mineflayer = require('mineflayer');
// Yahan aapka bot connection logic (Aternos IP/Port) aayega
