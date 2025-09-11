import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    videoId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema, "Comment");

export default Comment;