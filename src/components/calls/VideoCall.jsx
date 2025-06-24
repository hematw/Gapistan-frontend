// components/VideoCall.tsx
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles"; // include LiveKit styles
import { useState, useEffect } from "react";
import axiosIns from "../../utils/axios";
import { addToast } from "@heroui/toast";

export default function VideoCall({ userId, roomName }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
        try {
            const { data } = await axiosIns.get(
                `/livekit/get-livekit-token?userId=${userId}&roomName=${roomName}`
            );
            setToken(data.token);
        } catch (error) {
            addToast({
                title: "Error fetching token",
                description: error.response?.data?.message || "Failed to fetch token",
                color: "danger",
            });
            console.error("Error fetching LiveKit token:", error);
        }
    };

    fetchToken();
  }, [userId, roomName]);

  if (!token) return <div>Loading call...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
      connect={true}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
