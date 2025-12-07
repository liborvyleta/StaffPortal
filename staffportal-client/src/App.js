import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import HomeLanding from "./pages/HomeLanding";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CompanyPortal from "./pages/CompanyPortal";
import Departments from "./pages/Departments";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomeLanding />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />

                    {/* SuperAdmin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
                        <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    </Route>

                    {/* Company Routes (Admin + User) */}
                    <Route element={<ProtectedRoute allowedRoles={["CompanyAdmin", "User"]} />}>
                        <Route path="/portal/:slug" element={<CompanyPortal />} />
                    </Route>

                    {/* Company Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["CompanyAdmin"]} />}>
                        <Route path="/portal/:slug/departments" element={<Departments />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;