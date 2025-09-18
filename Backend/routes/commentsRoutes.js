import express from "express";
import {
    addComment,
    getComments,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
} from "../controllers/commentsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a new comment
router.post("/:videoId", protect, addComment);

// Get all comments for a video
router.get("/:videoId", getComments);

// Update a comment (only owner)
router.put("/:id", protect, updateComment);

// Delete a comment (only owner)
router.delete("/:id", protect, deleteComment);

//  Like a comment
router.put("/:id/like", protect, likeComment);

//  Dislike a comment
router.put("/:id/dislike", protect, dislikeComment);

export default router;