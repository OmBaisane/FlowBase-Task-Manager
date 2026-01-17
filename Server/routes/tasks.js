const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. GET ALL TASKS
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE NEW TASK 
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        username: req.body.username,
        status: req.body.status
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. DELETE TASK
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. UPDATE TASK 
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body, // New Data
            { new: true } // Return the updated document
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;