import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import SocketProvider from "../providers/SocketProvider";
import ConnectionStatusBanner from "../components/ConnectionStatusBanner";

function ProtectedLayout() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? (
    <SocketProvider>
      <ConnectionStatusBanner/>
      <Outlet />
    </SocketProvider>
  ) : (
    <Navigate to="/signin" replace={true} />
  );
}

export default ProtectedLayout;
