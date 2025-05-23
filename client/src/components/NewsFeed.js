// client/src/components/NewsFeed.js
import "./NewsFeed.css";
// import Background from "./Background.jsx";
import "./Background.css";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tech"); // Default to 'Tech' category
  const [noNews, setNoNews] = useState(false); // New state to track if no news is available

  useEffect(() => {
    // Reset the no news flag when category is changed
    setNoNews(false);
    setNews([]); // Clear previous news when category is changed

    // Subscribe to the selected category
    socket.emit("subscribe", category);

    // Listen for new news updates from the server
    const newsListener = (newNews) => {
      if (newNews.length === 0) {
        setNoNews(true); // Set flag to true when no news is received
      } else {
        setNews((prevNews) => [...prevNews, ...newNews]); // Append new news to existing news
        setNoNews(false); // Set flag to false when news is received
      }
      setLoading(false); // Stop loading when news is received
    };

    socket.on("news", newsListener);

    // Cleanup on unmount
    return () => {
      socket.off("news", newsListener);
    };
  }, [category]); // Re-run this effect when the category changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="title">📰 News App</h1>
      <div className="box">
        {/* <Background /> */}
      <div className="content">
        
        <h2 className="real-time-news-feed">Real-time News Feed</h2>
        <hr></hr>
        <div className="actual-news">
        {/* Category Dropdown */}
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Business">Business</option>
        </select>

        {/* Display news or 'No news available.' */}
        {noNews ? (
          <div>No news available.</div>
        ) : (
          news.map((item, index) => (
            <div key={index}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>{new Date(item.timestamp).toLocaleTimeString()}</small>
            </div>
          ))
        )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default NewsFeed;
