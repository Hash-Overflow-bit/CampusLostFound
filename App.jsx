import { Suspense } from "react";
import { useAuth } from "./AuthContext/AuthContext";
import MinimalLoader from "./componenets/loader/MinimalLoader";
import AppRouter from "./app/router";
import AppShell from "./components/layout/AppShell";
import AppErrorBoundary from "./components/state/AppErrorBoundary";

export default function App() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <MinimalLoader
        fullScreen
        message="Connecting your campus"
        detail="Checking your secure session and campus network."
      />
    );
  }

  return (
    <AppErrorBoundary>
      <AppShell>
        <Suspense
        fallback={
          <MinimalLoader
            fullScreen
            message="Opening CampusLostFound"
            detail="Loading the next part of your campus workspace."
          />
        }
      >
        <AppRouter />
        </Suspense>
      </AppShell>
    </AppErrorBoundary>
  );
}
