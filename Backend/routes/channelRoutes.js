import express from "express";
import multer from "multer";
import { createChannel, getChannelByHandle, getChannelByUserId } from "../controllers/channelControllers.js";
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
router.get('/byUser/:userId', getChannelByUserId);

export default router;