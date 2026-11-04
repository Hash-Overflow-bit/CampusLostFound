import React from "react";
import "./StatePanel.css";

const DEFAULT_ICON = {
  empty: "○",
  error: "!",
  success: "✓",
  info: "i",
  warning: "!",
};

export default function StatePanel({
  tone = "info",
  eyebrow,
  title,
  description,
  icon,
  action,
  secondaryAction,
  compact = false,
  className = "",
}) {
  const role = tone === "error" ? "alert" : "status";

  return (
    <section
      className={`state-panel state-panel--${tone}${compact ? " state-panel--compact" : ""}${className ? ` ${className}` : ""}`}
      role={role}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <div className="state-panel__icon" aria-hidden="true">
        {icon || DEFAULT_ICON[tone] || DEFAULT_ICON.info}
      </div>

      <div className="state-panel__content">
        {eyebrow && <p className="state-panel__eyebrow">{eyebrow}</p>}
        <h3>{title}</h3>
        {description && <p className="state-panel__description">{description}</p>}

        {(action || secondaryAction) && (
          <div className="state-panel__actions">
            {action && (
              <button type="button" className="state-panel__action" onClick={action.onClick} disabled={action.disabled}>
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button type="button" className="state-panel__action state-panel__action--secondary" onClick={secondaryAction.onClick} disabled={secondaryAction.disabled}>
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
