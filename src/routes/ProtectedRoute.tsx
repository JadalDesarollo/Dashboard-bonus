import { useAuthContext } from "auth/context/AuthContext";
import React, { useEffect } from "react";
import { Route, Navigate, RouteProps, Outlet } from "react-router-dom";
type ProtectedRouteProps = RouteProps & {
  children?: React.ReactNode
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth ,checkToken} = useAuthContext()
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('refresh');
        await checkToken();

      } catch (error) {
        console.error('Error al verificar el token:', error);
      }
    };

    fetchData();
  }, []);
  console.log(auth)
  return auth.logged ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/sign-in" />
  );
}
export default ProtectedRoute;
