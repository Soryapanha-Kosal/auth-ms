const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const USERS_FILE = path.join(__dirname, 'users.json');

// Load users from file
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Save users to file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  users.push({ username, password, role });
  saveUsers(users);

  res.json({ message: 'User registered' });
});

app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password && u.role === role);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Auth service running on port ${PORT}`));
