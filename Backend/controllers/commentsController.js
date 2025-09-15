import Comment from "../models/Comments.js";

//  Add Comment
export const addComment = async(req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { videoId } = req.params;
        const { text } = req.body;

        if (!videoId || !text) {
            return res.status(400).json({ message: "videoId and text are required" });
        }

        const comment = new Comment({
            videoId,
            userId: req.user._id,
            username: req.user.name,
            text,
            likes: [],
            dislikes: [],
        });

        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//  Get Comments for a Video
export const getComments = async(req, res) => {
    try {
        const { videoId } = req.params;
        const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Update Comment
export const updateComment = async(req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }

        comment.text = text || comment.text;
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Delete Comment
export const deleteComment = async(req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likeComment = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Remove from dislikes if present
        comment.dislikes = comment.dislikes.filter(
            (uid) => uid.toString() !== userId.toString()
        );

        // Toggle like
        if (comment.likes.includes(userId)) {
            comment.likes = comment.likes.filter(
                (uid) => uid.toString() !== userId.toString()
            );
        } else {
            comment.likes.push(userId);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const dislikeComment = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Remove from likes if present
        comment.likes = comment.likes.filter(
            (uid) => uid.toString() !== userId.toString()
        );

        // Toggle dislike
        if (comment.dislikes.includes(userId)) {
            comment.dislikes = comment.dislikes.filter(
                (uid) => uid.toString() !== userId.toString()
            );
        } else {
            comment.dislikes.push(userId);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};