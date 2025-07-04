import VideoCall from "@/components/calls/VideoCall";
import { useLocation } from "react-router-dom";

export default function CallPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const roomName = queryParams.get("roomName");

  
  return <VideoCall userId={userId} roomName={roomName} />;
}
