// Service Worker Registration for Performance Optimization
export const registerSW = () => {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered: ", registration);
      } catch (registrationError) {
        console.log("SW registration failed: ", registrationError);
      }
    });
  }
};
