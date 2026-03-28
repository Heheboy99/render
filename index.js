const express = require('express');
const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalFollow } = require('mineflayer-pathfinder').goals;
const { OpenAI } = require('openai');

// 1. Render ko jagaye rakhne ke liye Chhota Web Server
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bhai, tera AI Dost online hai aur grind kar raha hai!'));
app.listen(port, () => console.log(`Web server running on port ${port}`));

// 2. OpenAI (ChatGPT) Configuration
// Render ki settings (Environment Variables) mein OPENAI_API_KEY zaroor daalna
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

// 3. Minecraft Bot Configuration
const botArgs = {
    host: 'AapkaServer.aternos.me', // <--- Yahan apna Aternos IP daalo
    port: 25565,                   // Aternos ka port (check kar lena)
    username: 'AI_Dost_Ashish',    // Bot ka naam
    version: '1.20.1'              // Apne server ka version check karlo
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // Plugins load karna
    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('Bhai, main server mein aa gaya hoon!');
        bot.chat('Ram Ram bhaiyo! Main aa gaya doston ki tarah grind karne.');
    });

    // 4. AI Chat (Hindi/English/Hinglish)
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;

        // Agar aap ise command do "follow me"
        if (message.toLowerCase() === 'follow me') {
            const player = bot.players[username];
            if (!player) return bot.chat("Bhai dikh nahi rahe ho kahan ho?");
            const movements = new Movements(bot, require('minecraft-data')(bot.version));
            bot.pathfinder.setMovements(movements);
            bot.pathfinder.setGoal(new GoalFollow(player.entity, 1), true);
            return bot.chat("Theek hai bhai, tere peeche hi hoon.");
        }

        // ChatGPT se baatein karna
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {"role": "system", "content": "You are a helpful and funny Minecraft friend named AI_Dost. You speak in Hinglish. You are playing with your friend Ashish. You love grinding and building."},
                    {"role": "user", "content": `${username} said: ${message}`}
                ],
            });
            bot.chat(response.choices[0].message.content);
        } catch (err) {
            console.log("AI Error:", err);
        }
    });

    // Error handling aur Auto-Reconnect
    bot.on('error', (err) => console.log('Bot Error:', err));
    bot.on('end', () => {
        console.log('Bot disconnect ho gaya, 5 second mein firse join karega...');
        setTimeout(createBot, 5000);
    });
}

createBot();
