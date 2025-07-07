const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, role } = req.body;
  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(4000, () => console.log("Auth MS running on port 4000"));
