// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Channel from "./models/channel.js";
import Video from "./models/Videos.js";
import Comment from "./models/Comments.js";
import bcrypt from "bcryptjs";

const hashedPwd = await bcrypt.hash("123456", 10);


dotenv.config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" MongoDB connected");
    } catch (err) {
        console.error(" DB connection error:", err.message);
        process.exit(1);
    }
};

const seedData = async() => {
    try {
        await connectDB();

        // Clear existing data
        await Promise.all([
            User.deleteMany(),
            Channel.deleteMany(),
            Video.deleteMany(),
            Comment.deleteMany(),
        ]);
        console.log("Old data cleared");

        // Seed Users
        const users = await User.insertMany([
            { name: "Alice", email: "alice@example.com", password: hashedPwd },
            { name: "Bob", email: "bob@example.com", password: hashedPwd },
        ]);
        console.log(" Users seeded");

        // Seed Channels
        const channels = await Channel.insertMany([{
                name: "Alice Vlogs",
                handle: "@alicevlogs",
                profilePicture: "https://via.placeholder.com/150",
                user: users[0]._id,
            },
            {
                name: "Bob Tech",
                handle: "@bobtech",
                profilePicture: "https://via.placeholder.com/150",
                user: users[1]._id,
            },
        ]);
        console.log(" Channels seeded");

        // Seed Videos
        // Seed Videos
        const videos = await Video.insertMany([{
                title: "My First Vlog",
                description: "Welcome to my channel!",
                videoUrl: "https://www.youtube.com/embed/hQAHSlTtcmY",
                thumbnailUrl: "https://via.placeholder.com/300",
                channel: channels[0]._id,
                tags: ["vlog", "introduction"],
                uploader: users[0].name,
                category: "Lifestyle",
            },
            {
                title: "Tech Review 2025",
                description: "Latest gadgets review",
                videoUrl: "https://www.youtube.com/embed/7QUtEmBT_-w",
                thumbnailUrl: "https://via.placeholder.com/300",
                channel: channels[1]._id,
                tags: ["tech", "gadgets"],
                uploader: users[1].name,
                category: "Technology",
            },
        ]);

        console.log("Videos seeded");

        // Seed Comments
        await Comment.insertMany([{
                videoId: videos[0]._id.toString(),
                userId: users[1]._id.toString(),
                username: users[1].name,
                text: "Nice vlog Alice! 👏",
            },
            {
                videoId: videos[1]._id.toString(),
                userId: users[0]._id.toString(),
                username: users[0].name,
                text: "Great review Bob 🔥",
            },
        ]);
        console.log(" Comments seeded");

        console.log(" All data seeded successfully!");
        process.exit();
    } catch (err) {
        console.error(" Seeding error:", err);
        process.exit(1);
    }
};

seedData();