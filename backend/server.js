const express = require('express');
const cors = require('cors');
const app = express();

require('./connexion');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'MEAN API running 🚀' });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});