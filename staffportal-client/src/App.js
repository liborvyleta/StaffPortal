import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeLanding from "./pages/HomeLanding";
import RegisterCompany from "./pages/RegisterCompany";
import Contact from "./pages/Contact";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Login from "./pages/Login";
import CompanyPortal from "./pages/CompanyPortal";
import Departments from "./pages/Departments"; // Přidáno pro oddělení

// Komponenta pro chytré přesměrování z kořenové URL
const RootRedirect = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const companySlug = localStorage.getItem("companySlug"); // Musíme si toto ukládat při loginu!

    if (token) {
        if (role === "SuperAdmin") {
            return <Navigate to="/superadmin" replace />;
        } else if (companySlug) {
            return <Navigate to={`/portal/${companySlug}`} replace />;
        }
    }
    // Pokud není přihlášen, zobrazí HomeLanding
    return <HomeLanding />;
};

function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {/* Kořenová cesta nyní používá chytrou logiku */}
                <Route path="/" element={<RootRedirect />} />

                <Route path="/contact" element={<Contact />} />
                <Route path="/register-company" element={<RegisterCompany />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/superadmin"
                    element={isAuthenticated ? <SuperAdminDashboard /> : <Navigate to="/login" />}
                />

                {/* Cesta pro portál firmy */}
                <Route
                    path="/portal/:slug"
                    element={isAuthenticated ? <CompanyPortal /> : <Navigate to="/login" />}
                />

                {/* Cesta pro správu oddělení */}
                <Route
                    path="/portal/:slug/departments"
                    element={isAuthenticated ? <Departments /> : <Navigate to="/login" />}
                />

                {/* Fallback pro neznámé cesty */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;