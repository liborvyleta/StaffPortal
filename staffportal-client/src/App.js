import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomeLanding from "./pages/HomeLanding";
import RegisterCompany from "./pages/RegisterCompany";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Login from "./pages/Login";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeLanding/>}/>
                <Route path="/register-company" element={<RegisterCompany/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/superadmin" element={<SuperAdminDashboard/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Router>
    );
}

export default App;