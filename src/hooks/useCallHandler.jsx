import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { addToast } from "@heroui/toast";
import { useCallback } from "react";

export function useCallHandler({ socket, selectedChat }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [callTimeoutId, setCallTimeoutId] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  const myUser = selectedChat?.members?.find((m) => m._id === user._id);
  const targetUser = selectedChat?.members?.find((m) => m._id !== user._id);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ fromUserId, roomName, from }) => {
      setIncomingCall({ fromUserId, roomName, from });
    };

    const handleCallAccepted = ({ roomName }) => {
      // navigate(`/chat/video-call?userId=${user._id}&roomName=${roomName}`);
      navigate(`/chat/video-call?userId=${user.firstName ? user.firstName + " "+ user.lastName : user.username}&roomName=${roomName}`);
    };

    const handleCallRejected = () => {
      setIncomingCall(null);
      setIsCalling(false);
      clearTimeout(callTimeoutId);
      setCallTimeoutId(null);
      addToast({
        title: "Call Rejected",
        description: "The call was rejected.",
        color: "danger",
      });
    };

    const handleCallTimeout = () => {
      setIsCalling(false);
      clearTimeout(callTimeoutId);
      setCallTimeoutId(null);
      setIncomingCall(null);
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-timeout", handleCallTimeout);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-timeout", handleCallTimeout);
    };
  }, [socket, user._id, navigate]);

  const handleCall = useCallback(() => {
    if (!myUser || !targetUser) return;

    const roomName = selectedChat.isGroup
      ? selectedChat._id
      : `${myUser._id}-${targetUser._id}-room`;

    socket.emit("start-call", {
      toUserId: targetUser._id,
      fromUserId: myUser._id,
      from: selectedChat.isGroup
        ? ` ${user.firstName ? user.firstName : user.lastName} in ${
            selectedChat.chatName
          }`
        : `${selectedChat.chatName}`,
      roomName,
      isGroup: selectedChat.isGroup,
    });

    setIsCalling(true);

    const timeoutId = setTimeout(() => {
      setIsCalling(false);
      addToast({
        title: "Call Timeout",
        description: "The call was not answered in time.",
        color: "warning",
      });

      socket.emit("call-timeout", {
        toUserId: targetUser._id,
        roomName,
      });
    }, 30000);

    setCallTimeoutId(timeoutId);
  }, [myUser, selectedChat, socket, targetUser]);

  const cancelCall = useCallback(() => {
    if (callTimeoutId) {
      clearTimeout(callTimeoutId);
      setIncomingCall(null);
      setIsCalling(false);
      clearTimeout(callTimeoutId);
      setCallTimeoutId(null);
      addToast({
        title: "Call Cancelled",
        description: "You have cancelled the call.",
        color: "info",
      });

      socket.emit("call-timeout", {
        toUserId: targetUser._id,
        roomName: `${myUser._id}-${targetUser._id}-room`,
      });
    }
  }, [callTimeoutId, myUser, socket, targetUser]);

  const acceptCall = () => {
    if (!incomingCall) return;

    socket.emit("accept-call", {
      toUserId: incomingCall.fromUserId,
      roomName: incomingCall.roomName,
    });

    navigate(
      // `/chat/video-call?userId=${user._id}&roomName=${incomingCall.roomName}`
      `/chat/video-call?userId=${user.firstName ? user.firstName + " "+ user.lastName : user.username}&roomName=${incomingCall.roomName}`
    );
    setIncomingCall(null);
    setCallTimeoutId(null);
    setIsCalling(false);
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("call-rejected", {
        toUserId: incomingCall.fromUserId,
        roomName: incomingCall.roomName,
      });
    }

    clearTimeout(callTimeoutId);
    setCallTimeoutId(null);
    addToast({
      title: "Call Rejected",
      description: "You have rejected the call.",
      color: "danger",
    });

    setIncomingCall(null);
    setCallTimeoutId(null);
    setIsCalling(false);
  };

  return {
    isCalling,
    incomingCall,
    handleCall,
    cancelCall,
    acceptCall,
    rejectCall,
  };
}
