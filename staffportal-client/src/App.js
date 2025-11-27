import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeLanding from "./pages/HomeLanding";
import RegisterCompany from "./pages/RegisterCompany";
import Contact from "./pages/Contact";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Login from "./pages/Login"; // Nová stránka
import CompanyPortal from "./pages/CompanyPortal"; // Nová stránka
import Dashboard from "./pages/Dashboard"; // Původní dashboard (fallback)

function App() {
    // Jednoduchá kontrola přihlášení
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {/* Veřejné stránky */}
                <Route path="/" element={<HomeLanding />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register-company" element={<RegisterCompany />} />

                {/* Přihlášení */}
                <Route path="/login" element={<Login />} />

                {/* Chráněné sekce */}
                <Route
                    path="/superadmin"
                    element={isAuthenticated ? <SuperAdminDashboard /> : <Navigate to="/login" />}
                />

                {/* UNIKÁTNÍ PORTÁL PRO FIRMY (např. /portal/vyleta-software) */}
                <Route
                    path="/portal/:slug"
                    element={isAuthenticated ? <CompanyPortal /> : <Navigate to="/login" />}
                />

                {/* Fallback dashboard */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                />

                {/* Neznámá cesta -> domů */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;