import { useEffect, useState } from "react";

const ConnectionStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left0 w-screen text-center px-6 py-3 shadow-lg text-white font-semibold text-sm z-50 transition-all duration-300 ${
        isOnline ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {isOnline
        ? "You're back online"
        : "You're offline. Trying to reconnect..."}
    </div>
  );
};

export default ConnectionStatusBanner;
