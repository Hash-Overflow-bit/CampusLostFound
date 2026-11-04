import { useNavigate } from "react-router-dom";
import StatePanel from "../components/state/StatePanel";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <StatePanel
        tone="empty"
        eyebrow="404 · Page not found"
        title="This campus link does not exist."
        description="The page may have moved, the link may be incomplete, or the report is no longer available."
        action={{ label: "Go to dashboard", onClick: () => navigate("/dashboard") }}
        secondaryAction={{ label: "Back to home", onClick: () => navigate("/") }}
      />
    </main>
  );
}
