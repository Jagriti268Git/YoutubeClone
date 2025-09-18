import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    tags: { type: [String], default: [] },
    uploader: { type: String, required: true },
    category: { type: String, default: "General" },
    audience: { type: String, enum: ["notKids", "kids"], default: "notKids" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema, "Video");
export default Video;