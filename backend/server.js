const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'silentzone_secret_key';

let users = [];
let zones = [];
let zoneIdCounter = 0;

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hashedPassword };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/zones', (req, res) => {
  res.json(zones);
});

app.post('/api/zones', (req, res) => {
  const newZone = { id: Date.now().toString(), ...req.body };
  zones.push(newZone);
  res.status(201).json(newZone);
});

app.put('/api/zones/:id', (req, res) => {
  const id = req.params.id;
  const zoneIndex = zones.findIndex(zone => zone.id === id);
  if (zoneIndex === -1) {
    return res.status(404).json({ message: 'Zone not found' });
  }
  zones[zoneIndex] = { id, ...req.body };
  res.json(zones[zoneIndex]);
});

app.delete('/api/zones/:id', (req, res) => {
  const id = req.params.id;
  const zoneIndex = zones.findIndex(zone => zone.id === id);
  if (zoneIndex === -1) {
    return res.status(404).json({ message: 'Zone not found' });
  }
  const deletedZone = zones.splice(zoneIndex, 1)[0];
  res.json(deletedZone);
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from SilentZone Backend!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});