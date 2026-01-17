const mongoose = require('mongoose');

//TASK SCHEMA - DEFINES STRUCTURE OF DATA
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);