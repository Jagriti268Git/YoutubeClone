import Video from "../models/Videos.js";
import Channel from "../models/channel.js";
import path from "path";
import fs from "fs";

//Post video
export const createVideo = async(req, res) => {
    try {
        const { title, description, audience, tags, category } = req.body;


        const userId = req.user.userId || req.user._id;


        const channel = await Channel.findOne({ user: userId });
        if (!channel) {
            return res.status(400).json({ message: "You must create a channel first." });
        }

        // Uploaded files
        let videoUrl = "";
        let thumbnailUrl = "";

        if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
            videoUrl = req.files.videoFile[0].path;
        }

        if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
            thumbnailUrl = req.files.thumbnail[0].path;
        }

        const video = new Video({
            title,
            description: description || "",
            videoUrl,
            thumbnailUrl,
            channel: channel._id,
            uploader: channel.name,
            audience: audience || "notKids",
            tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
            category: category || "General",
        });

        await video.save();
        return res.status(201).json(video);
    } catch (err) {
        console.error("Error uploading video:", err);
        return res.status(500).json({ message: "Error uploading video", error: err.message });
    }
};
// GET all videos
export const getAllVideos = async(req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (err) {
        console.error("Error fetching videos:", err);
        res.status(500).json({ message: "Failed to fetch videos" });
    }
};

// GET VIDEOS BY CHANNEL
export const getVideosByChannel = async(req, res) => {
    try {
        const { channelId } = req.params;
        const videos = await Video.find({ channel: channelId }).sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch videos" });
    }
};

// DELETE VIDEO
export const deleteVideo = async(req, res) => {
    try {
        const { id } = req.params;
        await Video.findByIdAndDelete(id);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete video" });
    }
};

// UPDATE VIDEO
export const updateVideo = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, audience, tags } = req.body;

        const updateData = { title, description, audience };
        if (tags) updateData.tags = tags.split(",").map(t => t.trim());

        if (req.files.videoFile) updateData.videoUrl = `/uploads/videos/${req.files.videoFile[0].filename}`;
        if (req.files.thumbnail) updateData.thumbnailUrl = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;

        const updatedVideo = await Video.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedVideo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update video" });
    }
};
// Like a video
export const likeVideo = async(req, res) => {
    try {
        const { id } = req.params; // video ID
        const userId = req.user._id;

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Removed from dislikes if present
        video.dislikes = video.dislikes.filter(uid => uid.toString() !== userId.toString());

        // Toggle like
        if (video.likes.includes(userId)) {
            video.likes = video.likes.filter(uid => uid.toString() !== userId.toString());
        } else {
            video.likes.push(userId);
        }

        await video.save();
        res.json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to like video" });
    }
};

// Dislike a video
export const dislikeVideo = async(req, res) => {
    try {
        const { id } = req.params; // video ID
        const userId = req.user._id;

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Removed from likes if present
        video.likes = video.likes.filter(uid => uid.toString() !== userId.toString());

        // Toggle dislike
        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter(uid => uid.toString() !== userId.toString());
        } else {
            video.dislikes.push(userId);
        }

        await video.save();
        res.json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to dislike video" });
    }
};