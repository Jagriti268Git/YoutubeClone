const BASE_URL = "http://localhost:5000/";

export const normalizeVideo = (v) => {
    if (!v) v = {};

    // resolve thumbnail
    let thumb = "/default-thumbnail.png";
    if (v.thumbnailUrl) {
        thumb = v.thumbnailUrl;
    } else if (v.thumbnail) {
        thumb = v.thumbnail;
    } else if (
        v.snippet &&
        v.snippet.thumbnails &&
        v.snippet.thumbnails.medium &&
        v.snippet.thumbnails.medium.url
    ) {
        thumb = v.snippet.thumbnails.medium.url;
    }

    // resolve video link
    let videoLink = "";
    if (v.videoUrl) {
        videoLink = v.videoUrl;
    } else if (v.embedUrl) {
        videoLink = v.embedUrl;
    } else if (v.snippet && v.snippet.resourceId && v.snippet.resourceId.videoId) {
        videoLink = v.snippet.resourceId.videoId;
    }

    // fix paths if they’re not absolute URLs
    if (thumb && !/^https?:\/\//i.test(thumb)) {
        thumb = BASE_URL + thumb.replace(/^\//, "");
    }
    if (videoLink && !/^https?:\/\//i.test(videoLink)) {
        videoLink = BASE_URL + videoLink.replace(/^\//, "");
    }

    return {
        id: v.videoId || v._id || "",
        title: v.title || (v.snippet && v.snippet.title) || "Untitled",
        description: v.description || (v.snippet && v.snippet.description) || "",
        thumbnailUrl: thumb,
        videoUrl: videoLink,
        views: v.views || 0,
        likes: v.likes || 0,
        dislikes: v.dislikes || 0,
        duration: v.duration || "",
        uploader: v.uploader ||
            v.channelName ||
            (v.snippet && v.snippet.channelTitle) ||
            "Unknown",
        subscribers: v.subscribers || "0",
        uploadDate: v.uploadDate ||
            (v.snippet && v.snippet.publishedAt) ||
            new Date().toISOString(),
        category: v.category || "General",
    };
};