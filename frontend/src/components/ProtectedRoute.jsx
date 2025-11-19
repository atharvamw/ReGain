import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";

export default function ProtectedRoute({ children }) {
    const Auth = useContext(AuthContext);

    if (Auth.userAuth.firstName === null) {
        return <Navigate to="/login" replace />;
    }

    if (Auth.userAuth.firstName !== null && window.location.pathname === "/login") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}