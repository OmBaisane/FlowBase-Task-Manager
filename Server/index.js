const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); 
require('dotenv').config();

// Import Models
const User = require('./models/User');

const app = express();

// Middleware Configuration
app.use(cors());
app.use(express.json());

// --- ROOT ROUTE (Health Check) ---
app.get('/', (req, res) => {
    res.send('FlowBase API is running successfully.');
});

// --- SOCKET.IO CONFIGURATION ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200", // Angular Client URL
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log(`Client Connected: ${socket.id}`);
    socket.on("disconnect", () => console.log("Client Disconnected"));
});

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected via Atlas ✅');
    } catch (err) {
        console.error('Database Connection Failed:', err.message);
        process.exit(1); // Exit process with failure
    }
};
connectDB();

// --- SCHEMAS ---
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    username: { type: String, required: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// --- AUTHENTICATION ROUTES ---
app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken." });

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) { 
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        res.json({ message: "Login Successful", username: user.username, _id: user._id });
    } catch (err) { 
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});

// --- TASK ROUTES ---

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { 
        res.status(500).json({ message: "Error fetching tasks" }); 
    }
});

// Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        io.emit("task-updated"); // Notify clients
        res.status(201).json(newTask);
    } catch (err) { 
        console.error("Create Task Error:", err.message);
        res.status(400).json({ message: "Bad Request: " + err.message }); 
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        io.emit("task-updated");
        res.json({ message: 'Task removed successfully' });
    } catch (err) { 
        res.status(500).json({ message: "Deletion failed" }); 
    }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        io.emit("task-updated");
        res.json(updatedTask);
    } catch (err) { 
        console.error("Update Task Error:", err.message);
        res.status(400).json({ message: "Update Failed: " + err.message }); 
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 FlowBase Server running on port ${PORT}`));