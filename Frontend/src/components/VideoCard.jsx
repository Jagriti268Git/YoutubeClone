import React from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../utility/timeAgo.js";
import { formatNumber } from "../utility/formatNumber.js";

export default function VideoCard({ video, layout = "grid" }) {
  return (
    <article className={`video-card ${layout}`}>
      <div className="thumb">
        <Link to={`/video/${video.id}`}>
          <img src={video.thumbnailUrl} alt={video.title} />
        </Link>
      </div>

      <div className="meta">
        <h3 className="title" style={{ color: "grey", textDecoration: "none" }}>
          <Link style={{ color: "grey", textDecoration: "none" }} to={`/video/${video.id}`}>{video.title}</Link>
        </h3>
        <div className="channel">{video.uploader}</div>
        <div className="stats">
          {formatNumber(video.views)} views • {timeAgo(video.uploadDate)}
        </div>
        {layout === "list" && <div className="description">{video.description}</div>}
      </div>
    </article >
  );
}