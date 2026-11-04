import { useEffect, useState } from "react";
import "./StatePanel.css";

export default function NetworkStatus() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="network-state-banner" role="status" aria-live="polite">
      <strong>You’re offline.</strong>
      <span>CampusLostFound can stay open, but new reports and updates need a connection.</span>
    </div>
  );
}
