import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserCircle, FaPlay, FaEllipsisV } from "react-icons/fa";
import Header from "./Header";
import Sidebar from "./Sidebar";
import VideoUploadModal from "./VideoUploadModal.jsx";
import "../channel.css";
import "react-toastify/dist/ReactToastify.css";

export default function Channel() {
  const { handle } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);

  // Load channel from localStorage
  useEffect(() => {
    const savedChannel = localStorage.getItem("channel");
    if (savedChannel) {
      const parsed = JSON.parse(savedChannel);
      setChannel(parsed);

      if (handle && handle !== parsed.handle) {
        window.history.replaceState(null, "", `/channel/${parsed.handle}`);
      }
    }
  }, [handle]);

  // Fetch from backend if not in localStorage
  useEffect(() => {
    if (!channel && handle) {
      const fetchChannel = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/channels/${handle}`);
          setChannel(res.data);
          localStorage.setItem("channel", JSON.stringify(res.data));
        } catch (err) {
          console.error(err);
          toast.error("Failed to load channel");
        } finally {
          setLoading(false);
        }
      };
      fetchChannel();
    }
  }, [handle, channel]);

  // Fetch videos for this channel
  useEffect(() => {
    if (!channel?._id) return;

    const fetchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/channel/${channel._id}`);
        const normalizedVideos = res.data.map((v) => ({
          ...v,
          videoUrl: v.videoUrl.startsWith("http") ? v.videoUrl : `http://localhost:5000/${v.videoUrl}`,
          thumbnailUrl: v.thumbnailUrl.startsWith("http") ? v.thumbnailUrl : `http://localhost:5000/${v.thumbnailUrl}`,
        }));
        setVideos(normalizedVideos);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load videos");
      }
    };

    fetchVideos();
  }, [channel]);

  // Add or update video after upload
  const handleVideoUploaded = (video) => {
    setVideos((prev) => {
      const exists = prev.find((v) => v._id === video._id);
      return exists ? prev.map((v) => (v._id === video._id ? video : v)) : [video, ...prev];
    });
  };

  // Delete video
  const handleDeleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      toast.success("Video deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video.");
    }
  };

  if (loading) return <div className="loading-channel">Loading channel...</div>;
  if (!channel) return <div className="no-channel">No channel found</div>;

  return (
    <div className="channel-page-wrapper">
      <Header
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        showCreateButton
        onUploadClick={() => {
          if (!channel?._id) return toast.error("Please create a channel first!");
          setEditingVideo(null);
          setShowUploadModal(true);
        }}
      />

      <div className="channel-body">
        <Sidebar expanded={sidebarExpanded} />

        <main className={`channel-main-content ${sidebarExpanded ? "with-sidebar" : "collapsed-sidebar"}`}>
          {/* Channel Banner */}
          <div
            className="channel-banner"
            style={{ backgroundImage: `url(${channel.banner ? `http://localhost:5000/${channel.banner}` : "/default-banner.jpg"})` }}
          >
            <div className="channel-banner-overlay">
              <div className="channel-avatar-wrapper">
                {channel.profilePicture ? (
                  <img
                    key={channel.profilePicture} // force re-render when updated
                    src={
                      channel.profilePicture.startsWith("http")
                        ? channel.profilePicture
                        : `http://localhost:5000${channel.profilePicture}`
                    }
                    alt={channel.name}
                    className="channel-avatar"
                  />
                ) : (
                  <FaUserCircle className="channel-avatar-icon" />
                )}
              </div>
              <div className="channel-banner-info">
                <div className="channel-info-text">
                  <h1>{channel.name}</h1>
                  <p className="handle">{channel.handle}</p>
                  <p className="subscribers">{channel.subscribers || 0} subscribers</p>
                  <p className="description">{channel.description || ""}</p>
                  <button className={`subscribe-btn ${channel.subscribed ? "subscribed" : ""}`}>
                    {channel.subscribed ? "Subscribed" : "Subscribe"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="channel-tabs">
            <button className="tab">Home</button>
            <button className="tab">Videos</button>
            <button className="tab">Playlists</button>
            <button className="tab">About</button>
          </div>

          {/* Videos Grid */}
          <div className="channel-content">
            <h3 className="video-section-title">
              <FaPlay className="play-icon" /> Your Watch History
            </h3>
            <div className="videos-grid">
              {videos.length === 0 ? (
                <p>No videos yet.</p>
              ) : (
                videos.map((video) => (
                  <div className="video-card" key={video._id}>
                    <div className="video-thumbnail">
                      <Link to={`/watch/${video._id}`}>
                        <img src={video.thumbnailUrl} alt={video.title} />
                      </Link>
                    </div>
                    <h3 className="video-title">
                      <Link to={`/watch/${video._id}`}>{video.title}</Link>
                    </h3>

                    <div className="video-settings">
                      <FaEllipsisV className="settings-icon" />
                      <div className="settings-menu">
                        <span onClick={() => { setEditingVideo(video); setShowUploadModal(true); }}>Edit</span>
                        <span onClick={() => handleDeleteVideo(video._id)}>Delete</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {showUploadModal && (
        <VideoUploadModal
          onClose={() => setShowUploadModal(false)}
          channelId={channel._id}
          channelHandle={channel.handle}
          editingVideo={editingVideo}
          onVideoUploaded={handleVideoUploaded}
        />
      )}
    </div>
  );
}