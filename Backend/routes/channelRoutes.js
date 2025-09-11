import express from "express";
import multer from "multer";
import { createChannel, getChannelByHandle } from "../controllers/channelControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Protect route and handle file upload
router.post("/", protect, upload.single("picture"), createChannel);
router.get("/:handle", getChannelByHandle);

export default router;