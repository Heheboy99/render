const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('AI Dost is Online and Grinding!');
});

app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

// Iske neeche aapka Mineflayer aur AI ka poora code aayega...
