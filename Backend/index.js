import express from 'express';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from "./routes/channelRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import dotenv from 'dotenv';
import cors from "cors";
import fs from "fs";
import path from "path";
import videosRoutes from "./routes/videosRoutes.js";
dotenv.config();
connectDb();

const app = express();

// uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads folder");
}

//  CORS 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Parse JSON

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Serve static files
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/channels", channelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/comments", commentsRoutes);
app.
    // Test route
app.get("/", (req, res) => res.send("API is running..."));

//  server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));