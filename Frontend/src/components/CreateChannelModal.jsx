import React, { useState } from "react";
import "../createchannelModal.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function CreateChannelModal({ isOpen, onClose, onChannelCreated }) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  // console.log("Token being sent:", token);
  const token = sessionStorage.getItem("token");
  if (!isOpen) return null;

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("handle", handle);
      if (picture) formData.append("picture", picture);

      // Axios POST request
      const res = await axios.post("http://localhost:5000/api/channels", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",

        }
      });
      console.log("Token being sent:", token);
      const newChannel = res.data;
      console.log("Created channel:", newChannel);

      toast.success("Channel created successfully");

      // Notify parent component
      onChannelCreated(newChannel);

      // Reset form
      setName("");
      setHandle("");
      setPicture(null);
      onClose();

      // Navigate to user's channel page
      navigate(`/channel/${newChannel.handle}`);
    } catch (err) {
      console.error("Error creating channel:", err);
      toast.error(err.response?.data?.message || "Error creating channel, Please Try Again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>How you'll appear</h2>

        {/* Profile Picture Upload */}
        <div className="upload-section">
          <label htmlFor="picture-input">
            {picture ? (
              <img
                src={URL.createObjectURL(picture)}
                alt="avatar"
                className="preview-img"
              />
            ) : (
              <FaUserCircle
                style={{ color: "#065fd4" }}
                className="upload-icon"
                size={70}
              />
            )}
          </label>
          <input
            id="picture-input"
            type="file"
            accept="image/*"
            onChange={handlePictureUpload}
            hidden
          />
          <p className="select-text">Select picture</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="channel-form">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Handle</label>
          <input
            type="text"
            placeholder="@yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />

          <p className="terms">
            By clicking Create Channel you agree to YouTube's Terms of Service.
            Changes made to your name and profile picture are visible only on
            YouTube and not other Google services.{" "}
            <span style={{ color: "blue" }}>Learn more</span>
          </p>

          {error && <p className="error-text">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
