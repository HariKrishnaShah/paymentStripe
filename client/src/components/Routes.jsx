import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, role }) => {
  // Any Checks
  return <>{isAdmin(role) ? children : <Navigate to="/login" />}</>;
};

const isAdmin = (role = "") => {
  //JWT Token check
  // Expiration Check
  // Role Check
  return true;
};
