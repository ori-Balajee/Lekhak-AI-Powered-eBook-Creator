require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type","Authorization"],
    })
)

// connect Database
connectDB();

app.use(express.json());

app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server running at port ${PORT}`));