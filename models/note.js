const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

console.log("Connecting to db...");
mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.log("Error connecting to MongoDB: ", error);
    });

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: [5, "Note must be at least 5 characters long"],
        required: [true, "Please, enter the note text"]
    },
    important: Boolean
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Note', noteSchema);