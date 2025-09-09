import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
