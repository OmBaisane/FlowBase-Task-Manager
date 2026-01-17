const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); 

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
});

// MongoDB Connection (Clean Version)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log(err));

// Schema
const taskSchema = new mongoose.Schema({
    title: String,
    username: String,
    status: String
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// --- ROUTES ---

// 1. Get Tasks (Debug Mode)
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        console.log("✅ Data Manga Gaya: Success"); // Pata chalega request aayi
        res.json(tasks);
    } catch (err) { 
        console.log("🔥 DB ERROR AA GAYA:", err.message); // Ye line error print karegi
        res.status(500).json({ error: err.message }); 
    }
});

// 2. Create Task
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        io.emit("task-updated"); 
        res.json(newTask);
    } catch (err) { res.status(500).json(err); }
});

// 3. Delete Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        io.emit("task-updated");
        res.json({ message: 'Task Deleted' });
    } catch (err) { res.status(500).json(err); }
});

// 4. Update Task
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        io.emit("task-updated");
        res.json(updatedTask);
    } catch (err) { res.status(500).json(err); }
});

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));