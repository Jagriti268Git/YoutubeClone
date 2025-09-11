import React from "react";
import VideoCard from "./VideoCard";
import "../watchpage.css";

export default function WatchPage({ video, allVideos, onSelectVideo }) {
  const related = allVideos.filter((v) => v.id !== video.id).slice(0, 15);

  return (
    <div className="watch-page">
      <div className="watch-main">
        <div className="video-player">
          <iframe
            width="100%"
            height="480"
            src={video.url}
            title={video.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <h2>{video.title}</h2>
        <p className="channel">{video.channel}</p>
      </div>

      <aside className="watch-sidebar">
        {related.map((v) => (
          <div key={v.id} onClick={() => onSelectVideo(v)}>
            <VideoCard video={v} layout="list" />
          </div>
        ))}
      </aside>
    </div>
  );
}
