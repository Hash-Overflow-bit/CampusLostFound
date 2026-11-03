import React from "react";
import "./MinimalLoader.css";

const MinimalLoader = React.memo(({
  fullScreen = false,
  message = "Loading your campus",
  detail = "Getting the latest reports ready.",
  compact = false,
}) => (
  <div
    className={`campus-loader${fullScreen ? " campus-loader--fullscreen" : ""}${compact ? " campus-loader--compact" : ""}`}
    role="status"
    aria-live="polite"
    aria-label={message}
  >
    <div className="campus-loader__panel">
      <div className="campus-loader__mark" aria-hidden="true">
        <span className="campus-loader__core">C</span>
        <span className="campus-loader__orbit campus-loader__orbit--one" />
        <span className="campus-loader__orbit campus-loader__orbit--two" />
        <span className="campus-loader__dot campus-loader__dot--yellow" />
        <span className="campus-loader__dot campus-loader__dot--coral" />
      </div>

      <div className="campus-loader__copy">
        <strong>{message}</strong>
        {!compact && detail && <span>{detail}</span>}
      </div>

      <div className="campus-loader__progress" aria-hidden="true">
        <span />
      </div>
    </div>
  </div>
));

MinimalLoader.displayName = "MinimalLoader";

export default MinimalLoader;
