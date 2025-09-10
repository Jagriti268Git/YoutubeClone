import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import VideoPlayer from "./components/VideoPlayer";
import videosData from "./videosData";
import "./app.css";
import SignIn from "./components/SignIn";
import Channel from "./components/Channel";
import axios from "axios";
import { normalizeVideo } from "./utility/normalizeVideo";

export default function App() {
  // Combined local videos with API-fetched videos
  const [allVideos, setAllVideos] = useState(() =>
    videosData.map(normalizeVideo)
  );

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos/allVideos");


        const normalizedApiVideos = res.data.map(normalizeVideo);

        setAllVideos((prev) => [...prev, ...normalizedApiVideos]);
      } catch (err) {
        console.error("Failed to fetch API videos", err);
      }
    };

    fetchVideos();
  }, []);

  console.log("All videos being passed down:", allVideos);

  return (
    <Routes>
      {/*  passed videos as-is */}
      <Route path="/" element={<Home videos={allVideos} />} />
      <Route path="/watch/:id" element={<VideoPlayer videos={allVideos} />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/channel/:handle" element={<Channel />} />
    </Routes>
  );
}
