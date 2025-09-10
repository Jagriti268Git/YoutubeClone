import React from "react";
//import "./filterbar.css";

export default function FilterBar({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="filter-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}