import { useAuthContext } from "auth/context/AuthContext";
import React from "react";
import { Route, Navigate, RouteProps, Outlet } from "react-router-dom";
type ProtectedRouteProps = RouteProps & {
  children?: React.ReactNode
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth } = useAuthContext()
  return auth.logged ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/sign-in" />
  );
}
export default ProtectedRoute;
