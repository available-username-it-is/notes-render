require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middleware/error-handler");
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

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error));
})

app.post('/api/notes', (req, res, next) => {
    if (req.body.content === undefined) {
        return res.status(400).json({ msg: "Content is missing" });
    }

    const note = new Note({
        content: req.body.content,
        important: req.body.important || false
    });

    note.save()
        .then(note => res.json(note))
        .catch(err => next(err));
})

app.put('/api/notes/:id', (req, res, next) => {
    const note = {
        content: req.body.content,
        important: req.body.important 
    };

    Note.findByIdAndUpdate(req.params.id, note, { new: true, runValidators: true, context: "query" })
        .then(note => res.json(note))
        .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).json({ msg: "Unknown endpoint"} );
}

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});