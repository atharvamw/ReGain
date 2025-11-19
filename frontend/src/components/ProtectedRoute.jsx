import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";

export default function ProtectedRoute({ children }) {
    const { userAuth, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading... Please wait.</div>; // Visual indicator
    }

    if (!userAuth.firstName) {
        return <Navigate to="/login" replace />;
    }

    return children;
}