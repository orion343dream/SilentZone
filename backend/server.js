const express = require('express');

const app = express();

let zones = [];
let zoneIdCounter = 0;

const PORT = process.env.PORT || 3001;

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