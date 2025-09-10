import React from "react";
import { SiYoutubemusic, SiYoutubekids, SiYoutubeshorts, SiYoutubegaming } from "react-icons/si";
import {
  FaHome, FaHistory, FaShoppingBag, FaRegUserCircle, FaMusic,
  FaFilm, FaBroadcastTower, FaNewspaper, FaYoutube
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdSubscriptions, MdOutlineVideoStable, MdOutlineFeedback } from "react-icons/md";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { CiFlag1 } from "react-icons/ci";
import '../sidebar.css';
import { useNavigate } from "react-router-dom";
export default function Sidebar({ expanded, isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Dark background overlay */}
      {/*  <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={toggleSidebar} ></div> */}
      {/* Sidebar menu */}
      {/*   <aside className={`sidebar ${isOpen ? "open" : ""} ${expanded ? "expanded" : "collapsed"}`}> */}
      {/* ... sidebar content as before ... */}
      {/*   </aside> */}

      {/* Bottom nav (only mobile) */}
      <ul className="bottom-nav">
        <li onClick={() => navigate("/")}><FaHome size={20} /><span>Home</span></li>
        <li><SiYoutubeshorts size={20} /><span>Shorts</span></li>
        <li><MdSubscriptions size={20} /><span>Subs</span></li>
        <li><FaRegUserCircle size={20} /><span>You</span></li>
      </ul>
      <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
        {/* Main Section */}
        {!expanded ? (

          <ul className="collapsed-icons">
            <li onClick={() => navigate("/")}><FaHome size={20} /><span>Home</span></li>
            <li><SiYoutubeshorts size={20} /><span>Shorts</span></li>
            <li><MdSubscriptions size={20} /><span>Subscriptions</span></li>
            <li><FaRegUserCircle size={20} /><span>You</span></li>
            <li><FaHistory size={20} /><span>History</span></li>
          </ul>
        ) : (
          // --- Expanded: full sidebar ---
          <>
            <ul className="side-section">
              <li><FaHome size={20} /> <span>Home</span></li>
              <li><SiYoutubeshorts size={20} /> <span>Shorts</span></li>
              <li><MdSubscriptions size={20} /> <span>Subscriptions</span></li>
              <li><FaRegUserCircle size={20} /> <span>You</span></li>
              <li><FaHistory size={20} /> <span>History</span></li>
            </ul>

            <div className="divider" />
            <h4 className="section-title"><span>Explore</span></h4>
            <ul className="side-section">
              <li><FaShoppingBag size={20} /> <span>Shopping</span></li>
              <li><FaMusic size={20} /> <span>Music</span></li>
              <li><FaFilm size={20} /> <span>Films</span></li>
              <li><FaBroadcastTower size={20} /> <span>Live</span></li>
              <li><SiYoutubegaming size={20} /> <span>Gaming</span></li>
              <li><FaNewspaper size={20} /> <span>News</span></li>
              <li><MdOutlineVideoStable size={20} /> <span>Sports</span></li>
            </ul>

            <div className="divider" />
            <h4 className="section-title">More from YouTube</h4>
            <ul className="side-section">
              <li><FaYoutube className="yt-icon" /> <span>YouTube Premium</span></li>
              <li><SiYoutubemusic style={{ color: "red", fontSize: "20px" }} /> <span>YouTube Music</span></li>
              <li><SiYoutubekids style={{ color: "red", fontSize: "20px" }} /> <span>YouTube Kids</span></li>
            </ul>

            <div className="divider" />
            <ul className="side-section">
              <li><IoSettingsOutline size={20} /> <span>Settings</span></li>
              <li><CiFlag1 size={20} /> <span>Report History</span></li>
              <li><RxQuestionMarkCircled size={20} /> <span>Help</span></li>
              <li><MdOutlineFeedback size={20} /> <span>Send Feedback</span></li>
            </ul>

            <ul className="side-section">
              <h5>About Press Copyright Contact us Creator Advertise Developers</h5>
            </ul>

            <ul className="side-section">
              <h5>Terms PrivacyPolicy & Safety How YouTube works Test new features</h5>
              <li>© 2025 Google LLC</li>
            </ul>
          </>
        )}
      </aside>
    </>
  );
}
