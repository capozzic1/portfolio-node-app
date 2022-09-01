const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    src: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Project', projectSchema);