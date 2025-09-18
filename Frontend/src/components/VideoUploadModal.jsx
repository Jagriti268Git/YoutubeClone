import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../videouploadmodal.css";

export default function VideoUploadModal({ onClose, channelHandle, onVideoUploaded, channelName, editingVideo }) {
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState(editingVideo ? editingVideo.title : "");
  const [description, setDescription] = useState(editingVideo ? editingVideo.description : "");
  const [thumbnail, setThumbnail] = useState(null);
  const [tags, setTags] = useState(editingVideo ? editingVideo.tags?.join(",") : "");
  const [audience, setAudience] = useState(editingVideo ? editingVideo.audience : "notKids");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(editingVideo ? editingVideo.category : "General");
  const [uploader, setUploader] = useState(
    editingVideo ? editingVideo.uploader : channelName || ""
  );
  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setDescription(editingVideo.description);
      setTags(editingVideo.tags?.join(","));
      setAudience(editingVideo.audience);
      setVideoFile(null);
      setThumbnail(null);
      setCategory(editingVideo.category);
      setUploader(editingVideo.uploader);
    } else {
      setUploader(channelName || "");
    }
  }, [editingVideo, channelName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return toast.error("Title is required");
    if (!editingVideo && !videoFile) return toast.error("Please select a video file");
    if (!channelHandle) {
      toast.error("You must create a channel first!");
      return;
    }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("audience", audience);
      formData.append("uploader", uploader);
      if (tags) formData.append("tags", tags);
      if (videoFile) formData.append("videoFile", videoFile);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (category) formData.append("category", category);
      const url = editingVideo
        ? `http://localhost:5000/api/videos/${editingVideo._id}`
        : `http://localhost:5000/api/videos`;

      const method = editingVideo ? "put" : "post";

      const token = sessionStorage.getItem("token");
      // const token = localStorage.getItem("token");
      const res = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },

      });

      toast.success(editingVideo ? "Video updated successfully!" : "Video uploaded successfully!");
      if (onVideoUploaded) onVideoUploaded(res.data);

      onClose();
      navigate(`/channel/${channelHandle}`);
    } catch (err) {
      console.error("Video upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h2>{editingVideo ? "Edit Video" : "Upload Video"}</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {!editingVideo && (
            <label>
              Video File
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </label>
          )}

          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />
          </label>

          <label>
            Thumbnail
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </label>
          <label>
            Uploader
            <input type="text" value={uploader} readOnly />
          </label>
          <label>
            Tags (comma separated)
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
          <label>
            Category
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
          <label>
            Audience
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option value="notKids">Not made for kids</option>
              <option value="kids">Made for kids</option>
            </select>
          </label>

          <button type="submit" className="publish-btn" disabled={loading}>
            {loading ? (editingVideo ? "Updating..." : "Uploading...") : (editingVideo ? "Update" : "Publish")}
          </button>
        </form>
      </div>
    </div>
  );
}
