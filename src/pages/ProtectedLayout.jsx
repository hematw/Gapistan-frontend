import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, Navigate, Outlet } from "react-router-dom";
import SocketProvider from "../providers/SocketProvider";
import ConnectionStatusBanner from "../components/ConnectionStatusBanner";
import { Button } from "@heroui/button";
import { LayoutDashboard } from "lucide-react";

function ProtectedLayout() {
  const { isLoggedIn, user } = useAuth();
  return isLoggedIn ? (
    <SocketProvider>
      {user.isAdmin && (
        <Link to={"/dashboard/users"} className="absolute bottom-4 right-4">
          <Button color="warning" startContent={<LayoutDashboard />}>
            Dashboard
          </Button>
        </Link>
      )}
      <ConnectionStatusBanner />
      <Outlet />
    </SocketProvider>
  ) : (
    <Navigate to="/signin" replace={true} />
  );
}

export default ProtectedLayout;
