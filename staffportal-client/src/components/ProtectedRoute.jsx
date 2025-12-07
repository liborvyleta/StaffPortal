import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Uživatel je přihlášen, ale nemá práva -> redirect na jeho dashboard
        if(user.role === 'SuperAdmin') return <Navigate to="/superadmin" />;
        if(user.role === 'CompanyAdmin' || user.role === 'User') return <Navigate to={`/portal/${user.companySlug}`} />;
        return <Navigate to="/" />;
    }

    return <Outlet />;
}