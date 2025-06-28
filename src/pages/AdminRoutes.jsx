import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import ConnectionStatusBanner from "../components/ConnectionStatusBanner";

function AdminLayout() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ConnectionStatusBanner />
      <Outlet />
    </>
  );
}

export default AdminLayout;
