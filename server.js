const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const { addNote, findById, editNote, deleteNote } = require('./lib/notes.js');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.get('/api/notes', (req, res) => res.json(notes));

app.post('/api/notes', (req, res) => {
    if (!req.body.id) {
        req.body.id = uuidv4();
        addNote(req.body, notes);
    } else {
        editNote(req.body, notes);
    }
    res.json(notes);
});

app.delete('/notes/:id', (req, res) => {
    const note = findById(req.params.id, notes);

    deleteNote(note, notes);
    res.json();
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on http://localhost:${PORT}`);
});
