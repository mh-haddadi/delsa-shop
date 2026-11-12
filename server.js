require('dotenv').config();
const express = require('express');
const path = require('path');
const { send } = require('process');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/' , (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'))
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, shop: 'Delsa Shop' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));