import { Suspense } from "react";
import { useAuth } from "./AuthContext/AuthContext";
import MinimalLoader from "./componenets/loader/MinimalLoader";
import AppRouter from "./app/router";
import AppShell from "./components/layout/AppShell";

export default function App() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <MinimalLoader fullScreen={true} message="Initializing..." />;
  }

  return (
    <AppShell>
      <Suspense fallback={<MinimalLoader fullScreen={true} message="Loading..." />}>
        <AppRouter />
      </Suspense>
    </AppShell>
  );
}
