require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const Note = require('./models/note');

app.get('/api/notes', (req, res) => {
    Note.find({})
        .then(notes => {
            res.json(notes);
        });
});

app.get('/api/notes/:id', (req, res) => {
    const id = +req.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        return res.status(200).json(note);
    }
    res.statusMessage = "No such resource found, dumbass";
    res.status(404).json({ msg: res.statusMessage });
})

app.delete('/api/notes/:id', (req, res) => {
    const id = +req.params.id;
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
})

app.post('/api/notes', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ msg: "Content is missing" });
    }

    const note = req.body;
    note.id = notes.length + 1;
    notes.push(note);

    res.status(200).json(note);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});