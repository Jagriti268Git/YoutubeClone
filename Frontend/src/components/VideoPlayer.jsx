import { useParams, Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike, AiOutlineShareAlt, AiOutlineDownload, AiOutlineClockCircle, AiOutlineEye } from "react-icons/ai";
import { MdNotificationsActive, MdMenu, MdSubscriptions, MdHistory, MdOutlineVideoStable, MdOutlineFeedback } from "react-icons/md";
import { FaYoutube, FaHome, FaHistory, FaShoppingBag, FaRegUserCircle, FaMusic, FaFilm, FaBroadcastTower, FaNewspaper, FaCompass } from "react-icons/fa";
import { SiYoutubemusic, SiYoutubekids, SiYoutubeshorts, SiYoutubegaming } from "react-icons/si";
import { IoSettingsOutline } from "react-icons/io5";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { CiFlag1 } from "react-icons/ci";
import { useState, useEffect } from "react";
import Header from "./Header";
import VideoGrid from "./VideoGrid.jsx";
import Comments from "./Comments";
import { formatNumber } from "../utility/formatNumber";
import { timeAgo } from "../utility/timeAgo";
import "../VideoPlayer.css";
import { useNavigate } from "react-router-dom";

export default function VideoPlayer({ videos }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState(videos || []);
  const [loading, setLoading] = useState(!videos?.length);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const isLocalVideo = (url) => {
    if (!url) return false;
    return (
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".ogg") ||
      url.endsWith(".mov") ||
      url.endsWith(".mkv") ||
      url.endsWith(".avi")
    );
  };
  const isYouTubeEmbed = (url) => url?.includes("youtube.com/embed");
  const isVimeoEmbed = (url) => url?.includes("player.vimeo.com/video");
  //  Only fetch if no videos were passed
  useEffect(() => {
    const fetchVideos = async () => {
      if (!videos || videos.length === 0) {
        setLoading(true);
        try {
          const res = await axios.get("http://localhost:5000/api/videos/allVideos");
          const normalizedApiVideos = res.data.map(normalizeVideo);
          setAllVideos(normalizedApiVideos);
        } catch (err) {
          console.error("Failed to fetch videos", err);
          setAllVideos([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchVideos();
  }, [videos]);

  // Data is already normalized
  const video = allVideos.find((v) => String(v.id) === id);

  const toggleSidebar = () => {
    // Disable toggle on mobile
    if (window.innerWidth < 1024) return;
    setSidebarOpen((prev) => !prev);
  };
  const handleSearch = (term) => setSearchTerm(term);

  const filteredVideos = allVideos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading videos...</p>;
  if (!video) return <h2>Video not found</h2>;

  return (
    <div className="video-page">
      {/* Header */}
      <Header
        onMenuClick={toggleSidebar}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => setSearchTerm("")}
        suggestions={videos}
      />

      {/* Sidebar Drawer  */}
      <aside className={`sidebar-drawer ${sidebarOpen ? "open" : ""}`}>
        <div className="header-left">

          <button className="icon-btn" onClick={toggleSidebar}>
            <MdMenu size={22} />
          </button>
          <div className="logo">
            <FaYoutube color="red" size={24} />
            <span style={{ fontWeight: "500" }}>
              YouTube<sup style={{ fontWeight: "normal", fontSize: "10px" }}>IN</sup>
            </span>
          </div>
        </div>

        <ul className="side-section">
          <li onClick={() => navigate("/")}><FaHome size={20} /><span>Home</span></li>
          <li><SiYoutubeshorts size={20} /><span>Shorts</span></li>
          <li><MdSubscriptions size={20} /><span>Subscriptions</span></li>
          <li><FaRegUserCircle size={20} /><span>You</span></li>
          <li><FaHistory size={20} /><span>History</span></li>
        </ul>

        <div className="divider" />
        <h4 className="section-title"><FaCompass size={20} /> <span>Explore</span></h4>
        <ul className="side-section">
          <li><FaShoppingBag size={20} /><span>Shopping</span></li>
          <li><FaMusic size={20} /><span>Music</span></li>
          <li><FaFilm size={20} /><span>Films</span></li>
          <li><FaBroadcastTower size={20} /><span>Live</span></li>
          <li><SiYoutubegaming size={20} /><span>Gaming</span></li>
          <li><FaNewspaper size={20} /><span>News</span></li>
          <li><MdOutlineVideoStable size={20} /><span>Sports</span></li>
        </ul>

        <div className="divider" />
        <h4 className="section-title"><span>More from YouTube</span></h4>
        <ul className="side-section">
          <li><FaYoutube className="yt-icon" /><span>YouTube Premium</span></li>
          <li><SiYoutubemusic style={{ color: "red", fontSize: "20px" }} /><span>YouTube Music</span></li>
          <li><SiYoutubekids style={{ color: "red", fontSize: "20px" }} /><span>YouTube Kids</span></li>
        </ul>

        <div className="divider" />
        <ul className="side-section">
          <li><IoSettingsOutline style={{ fontSize: "20px" }} /><span>Settings</span></li>
          <li><CiFlag1 style={{ fontSize: "20px" }} /><span>Report History</span></li>
          <li><RxQuestionMarkCircled style={{ fontSize: "20px" }} /><span>Help</span></li>
          <li><MdOutlineFeedback style={{ fontSize: "20px" }} /><span>Send Feedback</span></li>
        </ul>

        <ul className="side-section">
          <h5>About Press Copyright Contact us Creator Advertise Developers</h5>
        </ul>
        <ul className="side-section">
          <h5>Terms Privacy Policy & Safety How YouTube works Test new features</h5>
          <li>© 2025 Google LLC</li>
        </ul>
      </aside>

      {/* Overlay */}
      {sidebarOpen && window.innerWidth >= 1024 && (
        <div className="overlay" onClick={toggleSidebar} />
      )}
      {searchTerm ? (
        <div className="search-results">
          <VideoGrid videos={filteredVideos} layout="grid" />
        </div>
      ) : (
        <>
          {/* Main Video Content */}
          {!video ? (
            <h2>Video not found</h2>
          ) : (
            <div className="video-content">
              <div className="video-wrapper">
                {isLocalVideo(video.videoUrl) && (
                  <video width="100%" height="500" controls>
                    <source src={video.videoUrl} type="video/mp4" />
                    <source src={video.videoUrl} type="video/webm" />
                    <source src={video.videoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {isYouTubeEmbed(video.videoUrl) && (
                  <iframe
                    width="100%"
                    height="500"
                    src={video.videoUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {isVimeoEmbed(video.videoUrl) && (
                  <iframe
                    width="100%"
                    height="500"
                    src={video.videoUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {!isLocalVideo(video.videoUrl) &&
                  !isYouTubeEmbed(video.videoUrl) &&
                  !isVimeoEmbed(video.videoUrl) && (
                    <p>Unsupported video format</p>
                  )}
              </div>
              <h1 className="video-title">{video.title}</h1>
              <p className="video-stats">
                {formatNumber(video.views)} views • {timeAgo(video.uploadDate)}
              </p>

              <div className="channel-bar">
                <div className="channel-info">
                  <img
                    src={`https://i.pravatar.cc/40?u=${video.uploader}`}
                    alt="channel"
                    className="channel-logo"
                  />
                  <div className="channel-text">
                    <h4>{video.uploader}</h4>
                    <p>{video.subscribers || "10k"} subscribers</p>
                  </div>
                </div>
                <button className="subscribe-btn">Subscribe</button>
                <div className="actions">
                  <button><AiOutlineLike size={20} />{formatNumber(video.likes)}</button>
                  <button><AiOutlineDislike size={20} /> {formatNumber(video.dislikes)}</button>
                  <button><AiOutlineShareAlt size={20} /> Share</button>
                  <button><AiOutlineDownload size={20} /> Download</button>
                </div>
              </div>

              <div className="description-box">
                <p>{video.description}</p>
              </div>

              {/* Comments */}
              <Comments video={video} />
            </div>
          )}

          {/* Related Videos */}
          {video && (
            <aside className="related-videos">
              {videos
                .filter((v) => v.id !== video.id)
                .map((v) => (
                  <Link
                    key={v.id}
                    to={`/watch/${v.id}`}
                    className="related-card"
                  >
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="related-thumb"
                    />
                    <div className="related-info">
                      <h4>{v.title}</h4>
                      <p>{v.uploader}</p>
                      <p>
                        <AiOutlineEye size={14} /> {formatNumber(v.views)} views •{" "}
                        {timeAgo(v.uploadDate)}
                      </p>
                      {v.duration && (
                        <p>
                          <AiOutlineClockCircle size={14} /> {v.duration}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
            </aside>
          )}
        </>
      )}
    </div>
  );
}