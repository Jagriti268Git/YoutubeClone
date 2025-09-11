import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaBars, FaSearch, FaMicrophone, FaUserCircle, FaBell } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CreateChannelModal from "./CreateChannelModal";
import VideoUploadModal from "./VideouploadModal";
import "../header.css";
import axios from 'axios'
export default function Header({
  onToggleSidebar,
  onSearch,
  searchTerm,
  setSearchTerm,
  onClear,
  suggestions = [],
  onMenuClick,
  showCreateButton = false,
  onUploadClick,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channel, setChannel] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const popupRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  //  user in sync with localStorage (optional if you update it elsewhere)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);
  // const savedChannel = localStorage.getItem("channel");
  // const channelName = savedChannel ? JSON.parse(savedChannel) : null;
  // Loaded  channel from localStorage or fetch from backend once
  useEffect(() => {
    if (!user?.handle) {
      setChannel(null);
      localStorage.removeItem("channel");
      return;
    }

    const fetchChannel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/channels/${user.handle}`);
        if (res.status === 200 && res.data) {
          setChannel(res.data);
          localStorage.setItem("channel", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
        setChannel(null);
        localStorage.removeItem("channel");
      }
    };

    fetchChannel();
  }, [user?.handle, channel?._id]);
  // Closed user modal when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowUserModal(false);
      }
    }
    if (showUserModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserModal]);
  // Loaded channel from localStorage or fetch from backend once
  // useEffect(() => {
  //   if (!user?.handle) return;

  //   const fetchChannel = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:5000/api/channels/${user.handle}`
  //       );
  //       if (res.status === 200 && res.data) {
  //         setChannel(res.data);
  //         localStorage.setItem("channel", JSON.stringify(res.data));
  //       } else {
  //         setChannel(null);
  //         localStorage.removeItem("channel");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching channel:", err);
  //       setChannel(null);
  //       localStorage.removeItem("channel");
  //     }
  //   };

  //   fetchChannel();
  // }, [user]);

  // Keep localStorage in sync when channel changes
  /*  useEffect(() => {
     if (channel) {
       localStorage.setItem("channel", JSON.stringify(channel));
     }
   }, [channel]); */
  // Handlers
  const handleAvatarClick = () => setShowUserModal((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("channel");
    setChannel(null);
    setShowUserModal(false);
    navigate("/");
  };

  return (
    <header className="header">
      {/* LEFT */}
      <div className="header-left">
        <FaBars
          className="menu-icon"
          onClick={() => {
            onToggleSidebar?.();
            onMenuClick?.();
          }}
        />
        <img
          src="/youtube-logo.png"
          alt="YouTube"
          className="yt-logo"
          onClick={() => navigate("/")}
        />
        <span
          onClick={() => navigate("/")}
          style={{ fontWeight: "500", fontStyle: "revert" }}
        >
          YouTube
          <sup style={{ fontWeight: "normal", fontSize: "10px", padding: "5px" }}>
            IN
          </sup>
        </span>
      </div>

      {/* CENTER (desktop/tablet search) */}
      <div className="header-center">
        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm) onSearch(searchTerm);
            setShowSuggestions(false);
          }}
        >
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchTerm}
              placeholder="Search"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => searchTerm && setShowSuggestions(true)}
            />
            {searchTerm && <IoMdClose className="clear-icon" onClick={onClear} />}
          </div>
          <button type="submit" className="search-btn">
            <FaSearch />
          </button>
          <button type="button" className="mic-btn">
            <FaMicrophone />
          </button>
        </form>
      </div>

      {/* Search trigger for mobile */}
      <div
        className="search-trigger"
        onClick={() => setMobileSearchOpen(true)}
        style={{ display: "none" }}
      >
        <FaSearch />
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="mobile-search-active">
          <input
            type="text"
            autoFocus
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoMdClose
            className="close-btn"
            onClick={() => {
              setMobileSearchOpen(false);
              setShowSuggestions(false);
            }}
          />
        </div>
      )}


      {/* RIGHT */}
      <div className="header-right">
        {/* Upload */}
        <div className="icon-wrapper" style={{ position: "relative" }}>
          <MdVideoCall
            className="header-icon"
            onClick={() => setShowUploadOptions(!showUploadOptions)}
          />
          {showUploadOptions && (
            <div ref={popupRef} className="upload-options-popup">
              <div
                className="popup-option"
                onClick={() => {
                  setShowUploadModal(true);
                  setShowUploadOptions(false);
                }}
              >
                Upload Video
              </div>
              <div
                className="popup-option"
                onClick={() => {
                  alert("Go Live clicked!");
                  setShowUploadOptions(false);
                }}
              >
                Go Live
              </div>
            </div>
          )}
        </div>

        <FaBell className="header-icon" />
        {showUploadModal && <VideoUploadModal channelId={channel?._id}
          channelHandle={channel?.handle} onClose={() => setShowUploadModal(false)} />}

        {/* User Avatar */}
        {user ? (
          <div className="user-avatar-wrapper">
            <div className="avatar" onClick={handleAvatarClick}> {channel?.avatar ? <img src={channel.avatar} alt={channel.name} className="avatar-img" /> : (channel ? channel.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase())} </div>

            {showUserModal && (
              <div className="user-modal" ref={modalRef}>
                <p className="user-name">{user.name || user.email}</p>
                {channel ? (
                  <div
                    className="channel-link"
                    style={{ cursor: "pointer", padding: "6px 0" }}
                    onClick={() => {
                      navigate(`/channel/${channel.handle}`);
                      setShowUserModal(false);
                    }}
                  >
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      {channel.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      {channel.handle}
                    </div>
                  </div>
                ) : (
                  <div
                    className="create-channel"
                    style={{ cursor: "pointer", color: "blue", padding: "6px 0" }}
                    onClick={() => {
                      setIsModalOpen(true);
                      setShowUserModal(false);
                    }}
                  >
                    + Create Channel
                  </div>
                )}
                <p
                  className="logout-text"
                  style={{ cursor: "pointer", marginTop: "8px" }}
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="signin-btn-wrapper" onClick={() => navigate("/signin")}>
            <FaUserCircle className="signin-icon" />
            <span className="signin-text">Sign in</span>
          </div>
        )}
      </div>

      <CreateChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChannelCreated={(newChannel) => {
          setChannel(newChannel);
          localStorage.setItem("channel", JSON.stringify(newChannel));

          // ensure user.handle is updated
          const storedUser = JSON.parse(localStorage.getItem("user")) || {};
          const updatedUser = { ...storedUser, handle: newChannel.handle };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);

          setIsModalOpen(false);
          navigate(`/channel/${newChannel.handle}`);
        }}
      />
    </header>
  );
}
