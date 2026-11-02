import React from "react";
import "./MinimalLoader.css";

const MinimalLoader = React.memo(
  ({ fullScreen = false, message = "Loading..." }) => (
    <div className={`minimal-loader ${fullScreen ? "fullscreen" : ""}`}>
      <div className="loader-content">
        <div className="minimal-spinner"></div>
        {fullScreen && <p className="loader-message">{message}</p>}
      </div>
    </div>
  )
);

export default MinimalLoader;
