import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    tags: { type: [String], default: [] },
    audience: { type: String, enum: ["notKids", "kids"], default: "notKids" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Video", videoSchema, "Video");