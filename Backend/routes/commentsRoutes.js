import express from "express";
import { addComment, getComments, updateComment, deleteComment } from "../controllers/commentsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:videoId", protect, addComment);
router.get("/:videoId", getComments);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;