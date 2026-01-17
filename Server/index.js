const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const taskRoutes = require('./routes/tasks'); // IMPORT ROUTES

//CONFIG SETUP
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

connectDB();

//ROUTES SETUP
app.use('/api/tasks', taskRoutes);

//Test Route
app.get('/', (req, res)=> {
    res.send("FlowBase Server is Running");
})

//Server Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});