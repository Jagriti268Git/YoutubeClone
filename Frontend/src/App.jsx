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
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.valid) {
            setUser(res.data.user); // backend returns user
          } else {
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .catch(() => {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);



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
  console.log("Current user:", user);

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
