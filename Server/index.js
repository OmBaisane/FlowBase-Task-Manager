const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); 

// Import User Model
const User = require('./models/User'); // <-- Ye line nayi hai

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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log(err));

// Task Schema (Yahi rakha hai simple rakhne ke liye)
const taskSchema = new mongoose.Schema({
    title: String,
    username: String, // Ab hum yahan Login wale ka naam dalenge
    status: String
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// --- AUTH ROUTES (LOGIN & REGISTER) --- 🔐

// 1. REGISTER
app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        // Create new user (Password encryption hum baad me dekhenge, abhi simple rakhte hain)
        const newUser = new User({ username, password });
        await newUser.save();
        
        res.json({ message: "Registration Successful! ✅" });
    } catch (err) { res.status(500).json(err); }
});

// 2. LOGIN
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Check password (simple check for now)
        if (user.password !== password) return res.status(400).json({ message: "Wrong Password!" });

        // Success
        res.json({ 
            message: "Login Successful!", 
            username: user.username,
            _id: user._id 
        });
    } catch (err) { res.status(500).json(err); }
});

// --- TASK ROUTES --- ✅

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        io.emit("task-updated"); 
        res.json(newTask);
    } catch (err) { res.status(500).json(err); }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        io.emit("task-updated");
        res.json({ message: 'Task Deleted' });
    } catch (err) { res.status(500).json(err); }
});

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