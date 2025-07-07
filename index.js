const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const users = []; // In-memory user store

// Register route
app.post('/register', (req, res) => {
  const { username, role } = req.body;

  // Check if user already exists
  const existing = users.find(user => user.username === username);
  if (existing) return res.status(409).json("User already exists");

  users.push({ username, role });
  res.status(201).json("User registered");
});

// Login route
app.post('/login', (req, res) => {
  const { username, role } = req.body;

  const user = users.find(user => user.username === username && user.role === role);
  if (!user) return res.status(401).json("Invalid credentials");

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(4000, () => {
  console.log("Auth MS running on port 4000");
});
