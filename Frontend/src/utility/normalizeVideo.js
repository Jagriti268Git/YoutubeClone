const BASE_URL = "http://localhost:5000/"; // adjust to your backend

export const normalizeVideo = (v) => {
    let thumb = "/default-thumbnail.png";
    let videoLink = "";

    // ✅ Resolve thumbnail
    if (v.thumbnailUrl) {
        thumb = v.thumbnailUrl;
    } else if (v.thumbnail) {
        thumb = v.thumbnail;
    } else if (v.snippet && v.snippet.thumbnails && v.snippet.thumbnails.medium && v.snippet.thumbnails.medium.url) {
        thumb = v.snippet.thumbnails.medium.url;
    }

    // ✅ Fix relative thumbnail path
    if (thumb && !thumb.startsWith("http")) {
        thumb = BASE_URL + thumb.replace(/^\//, "");
    }

    // ✅ Resolve video URL
    if (v.videoUrl) {
        videoLink = v.videoUrl;
    } else if (v.embedUrl) {
        videoLink = v.embedUrl;
    } else if (v.snippet && v.snippet.resourceId && v.snippet.resourceId.videoId) {
        videoLink = v.snippet.resourceId.videoId;
    }

    if (videoLink && !videoLink.startsWith("http")) {
        videoLink = BASE_URL + videoLink.replace(/^\//, "");
    }

    return {
        id: v.videoId || v._id,
        title: v.title || (v.snippet && v.snippet.title) || "Untitled",
        description: v.description || (v.snippet && v.snippet.description) || "",
        thumbnailUrl: thumb,
        videoUrl: videoLink,
        views: v.views || 0,
        likes: v.likes || 0,
        dislikes: v.dislikes || 0,
        duration: v.duration || "",
        uploader: v.uploader || v.channelName || (v.snippet && v.snippet.channelTitle) || "Unknown",
        subscribers: v.subscribers || "0",
        uploadDate: v.uploadDate || (v.snippet && v.snippet.publishedAt) || new Date().toISOString(),
        category: v.category || "General",
    };
};