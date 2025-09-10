import React from "react";
import "../shimmer.css";

export default function ShimmerCard() {
  return (
    <div className="shimmer-card">
      <div className="shimmer-thumb"></div>
      <div className="shimmer-info">
        <div className="shimmer-line short"></div>
        <div className="shimmer-line"></div>
      </div>
    </div>
  );
}
