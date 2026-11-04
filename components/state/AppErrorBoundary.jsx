import React from "react";
import StatePanel from "./StatePanel";
import "./StatePanel.css";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error("CampusLostFound render error:", error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="app-error-state">
        <StatePanel
          tone="error"
          eyebrow="Something went wrong"
          title="This screen could not finish loading."
          description="Your account and reports are still protected. Reload the page to retry, or return to the home page if the problem continues."
          action={{ label: "Reload page", onClick: () => window.location.reload() }}
          secondaryAction={{ label: "Go to home", onClick: () => { window.location.href = "/"; } }}
        />
      </main>
    );
  }
}
