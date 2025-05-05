import React from "react";  // <- IMPORTANTE: Asegúrate de importar React
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth";

interface PrivateRouteProps {
  children: React.ReactNode; // <- Cambia JSX.Element por React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
