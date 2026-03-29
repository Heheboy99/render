const mineflayer = require('mineflayer')
const express = require('express')

// =======================
// EXPRESS WEB SERVER
// =======================
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Bot is alive!')
})

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`)
})

// =======================
// MINEFLAYER BOT
// =======================
function createBot() {
    const bot = mineflayer.createBot({
        host: 'errormc02.aternos.me', // <-- change this to your server IP or hostname
        port: 54990,            // default Minecraft port
        username: 'AlwaysChill',          // your bot name
        // password: '',         // if using Microsoft account
        version: '1.21.11'       // server version
    })

    bot.on('spawn', () => {
        console.log('Bot has joined the server!')
    })

    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        if (message.toLowerCase() === 'hello') {
            bot.chat(`Hello ${username}!`)
        }
    })

    bot.on('kicked', (reason) => {
        console.log('Bot was kicked:', reason)
    })

    bot.on('end', (reason) => {
        console.log('Bot disconnected. Reason:', reason, '- Reconnecting in 5 seconds...')
        setTimeout(createBot, 5000)
    })

    bot.on('error', err => {
        console.log('Bot error:', err)
    })
}

// Start bot
createBot()
