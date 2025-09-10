import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let uploadPath = "uploads/";

        if (file.fieldname === "videoFile") {
            uploadPath = "uploads/videos";
        } else if (file.fieldname === "thumbnail") {
            uploadPath = "uploads/thumbnails";
        }

        // ensure directory exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Allowed extensions
    const allowedVideos = [".mp4", ".mov", ".mkv", ".avi", ".webm"];
    const allowedImages = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    if (file.fieldname === "videoFile") {
        if (allowedVideos.includes(ext)) cb(null, true);
        else cb(new Error("Only video files are allowed (mp4/mov/mkv/avi/webm)"));
    } else if (file.fieldname === "thumbnail") {
        if (allowedImages.includes(ext)) cb(null, true);
        else cb(new Error("Only image files are allowed (jpg/png/jpeg/gif/webp)"));
    } else {
        cb(new Error("Invalid file field"));
    }
};

const upload = multer({ storage, fileFilter });

export default upload;