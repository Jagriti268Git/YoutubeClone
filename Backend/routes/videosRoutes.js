import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";

import { createVideo, updateVideo, deleteVideo, getVideosByChannel, getAllVideos } from "../controllers/videosController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname === "videoFile") cb(null, "uploads/videos/");
        else if (file.fieldname === "thumbnail") cb(null, "uploads/thumbnails/");
        else cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });

router.post(
    "/",
    protect,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    createVideo);
router.put("/:id", upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), updateVideo);
router.delete("/:id", deleteVideo);
router.get("/channel/:channelId", getVideosByChannel);
router.get("/allVideos", getAllVideos);
export default router;