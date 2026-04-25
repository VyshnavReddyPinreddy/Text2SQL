import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { API } from "./services/api";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    API.get("/me")
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        Checking session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
