import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
//import { normalizeVideo } from "../utility/normalizeVideo";
//import "./videocard.css";

export default function VideoGrid({ videos, layout = "grid" }) {

  const navigate = useNavigate();

  if (!videos.length) return <div className="no-results">No results found</div>;

  return (
    <div className={`video-grid ${layout}`}>
      {videos.map((v) => (
        <div key={v.videoId} onClick={() => navigate(`/watch/${v.id}`)}>
          <VideoCard video={v} layout={layout} />
        </div>
      ))}
    </div>
  );
}
