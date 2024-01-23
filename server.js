const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbFilePath = path.join(__dirname, 'db', 'db.json');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4();9

  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  notes.push(newNote);

  fs.writeFileSync(dbFilePath, JSON.stringify(notes));

  res.json(newNote);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

