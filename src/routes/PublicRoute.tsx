import { useAuthContext } from "auth/context/AuthContext";
import React, { useEffect } from "react";
import { Route, Navigate, RouteProps, Outlet } from "react-router-dom";
type ProtectedRouteProps = RouteProps & {
    children?: React.ReactNode
};
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { auth, checkToken } = useAuthContext();

    if (!auth.logged) {
        return <>{children}</>;
    } else {
        return <Navigate to="/" />;
    }
};
export default PublicRoute;
