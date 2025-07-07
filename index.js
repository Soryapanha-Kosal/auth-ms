const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const USERS = [
  { username: 'student1', role: 'student' },
  { username: 'teacher1', role: 'teacher' }
];

app.post('/login', (req, res) => {
  const { username, role } = req.body;
  const user = USERS.find(u => u.username === username && u.role === role);

  if (!user) return res.status(401).json("Invalid credentials");

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(4000, () => console.log("Auth MS running on port 4000"));
