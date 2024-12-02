const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// API to fetch events
app.get('/api', (req, res) => {
  const filePath = path.join(__dirname, 'public','db.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read database' });
    }
    const events = JSON.parse(data);
    res.json(events);
  });
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public','index.html'); // Ensure index.html is in the same folder
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Failed to load the page');
    }
    res.send(data); // Send the HTML content
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});