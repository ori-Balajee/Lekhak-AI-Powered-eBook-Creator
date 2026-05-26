// Loads variables from a .env file into process.env
require("dotenv").config();

const express = require("express");

// Enables cross-origin requests. 
// Without it : frontend (React) cannot talk to backend
const cors = require("cors");

// Help work with files and foldershttps://www.youtube.com/watch?v=gmuTjeQUbTM&list=PLNKUcsB3XI_68EIWp7nLQIj4joCrlsWeN&index=197
const path = require("path");

// Imports CUSTOM function from folder config to connect MongoDB
const connectDB = require("../config/db");

// backend application container
const app = express();

// MORE
app.use(
    cors({
        // allows ANY frontend (not secure for production)
        origin: "*",
        // allows HTTP methods
        methods: ["GET", "POST", "PUT", "DELETE"],
        // allows extra info in requests
        allowedHeaders: ["Content-Type","Authorization"],
    })
)

// connect Database
connectDB();

// lets server read JSON from requests
app.use(express.json());

// MORE
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server running at port ${PORT}`));