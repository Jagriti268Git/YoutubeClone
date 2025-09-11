import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import VideoGrid from "./components/VideoGrid";
import videosData from "./videosData";
import "./home.css";

export default function Home({ videos }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchDone = localStorage.getItem("hasSearched");
    if (searchDone === "true") setHasSearched(true);
  }, []);


  const categories = ["All", ...new Set(videos.map((v) => v.category))];


  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = videos.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, videos]);

  // Filter videos (category + search)
  const filteredVideos = videos
    .filter((v) =>
      activeCategory === "All" ? true : v.category === activeCategory
    )
    .filter((v) =>
      searchTerm ? v.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setActiveCategory("All");
    setHasSearched(false);
    localStorage.removeItem("hasSearched");
  };

  // Handle search submission
  const handleSearch = (text) => {
    setSearchTerm(text);
    setActiveCategory("All");
    setHasSearched(true);
    localStorage.setItem("hasSearched", "true");
  };

  return (
    <div className={`app ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <Header
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onClear={handleClear}
        suggestions={suggestions}
      />

      <div className="app-body">
        <Sidebar
          expanded={sidebarOpen}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen((s) => !s)}
        />
        <main className="main-area">
          {hasSearched ? (
            <>
              <FilterBar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
              <VideoGrid
                videos={filteredVideos.length ? filteredVideos : videos.slice(0, 6)}
                layout="grid"
                isSearchResults={hasSearched}
              />
            </>
          ) : (
            <div className="no-search-message">
              <h2>Try searching to get started</h2>
              <p>
                Start watching videos to help us build a feed of videos that
                you'll love.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}