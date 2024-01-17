import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ProtectedRoute from "routes/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAuthContext } from "auth/context/AuthContext";
import PublicRoute from "routes/PublicRoute";
// App
const App = () => {
  const { auth, checkToken } = useAuthContext();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!auth.logged) {
          // Evitar la verificación del token si ya está autenticado
          await checkToken();
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      } finally {
        setCheckingToken(false);
      }
    };

    fetchData();
  }, [auth.logged]);


  if (checkingToken) {
    return <div>Cargando...</div>;
  }

  if (auth.logged  ) {
    return (
      <Routes>
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    );
  }
};

export default App;

