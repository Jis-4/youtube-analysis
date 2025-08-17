require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const analyzeRouter = require('./routes/analyze');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '..', 'public')));
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

// UI form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API
app.use('/analyze', analyzeRouter);

// result endpoint
app.get('/result/:id', (req, res) => {
  const storage = require('./storage');
  const id = req.params.id;
  const result = storage.loadResult(id);
  if (!result) return res.status(404).json({ error: 'not found' });
  res.json(result);
});

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
