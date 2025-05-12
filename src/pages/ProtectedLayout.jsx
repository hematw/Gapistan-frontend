import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import SocketProvider from "../providers/SocketProvider";

function ProtectedLayout() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ) : (
    <Navigate to="/signin" replace={true} />
  );
}

export default ProtectedLayout;
