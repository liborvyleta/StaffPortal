import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CompanyPortal() {
    const { slug } = useParams(); // Získá "slug" z URL
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Zde voláme API pro získání zaměstnanců.
        // Poznámka: V plné verzi by backend měl filtrovat zaměstnance podle ID firmy přihlášeného uživatele.
        fetch("http://localhost:5083/api/employees", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.status === 401) {
                    navigate("/login");
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then(data => {
                setEmployees(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug, token, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f4f7f6", minHeight: "100vh" }}>
            {/* Horní lišta */}
            <nav style={{
                background: "#1f4e79",
                color: "white",
                padding: "15px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ margin: 0, fontSize: "24px" }}>{slug} <span style={{fontWeight: "300", opacity: 0.8}}>Portal</span></h2>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span style={{ fontSize: "14px", background: "rgba(255,255,255,0.1)", padding: "5px 10px", borderRadius: "20px" }}>
                        👤 {role}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#dc3545",
                            border: "none",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                    >
                        Odhlásit
                    </button>
                </div>
            </nav>

            {/* Obsah */}
            <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
                <header style={{ marginBottom: "30px", borderBottom: "2px solid #e0e0e0", paddingBottom: "20px" }}>
                    <h1 style={{ color: "#333", margin: 0 }}>Přehled zaměstnanců</h1>
                    <p style={{ color: "#777", marginTop: "5px" }}>Vítejte v portálu společnosti <strong>{slug}</strong></p>
                </header>

                {loading ? (
                    <p>Načítám data...</p>
                ) : (
                    <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 2px 15px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #eee" }}>
                            <tr>
                                <th style={thStyle}>Jméno</th>
                                <th style={thStyle}>Pozice</th>
                                <th style={thStyle}>Oddělení</th>
                                <th style={thStyle}>Plat</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.length > 0 ? employees.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={tdStyle}><strong>{emp.name}</strong></td>
                                    <td style={tdStyle}>{emp.position}</td>
                                    <td style={tdStyle}>{emp.departmentName || "—"}</td>
                                    <td style={tdStyle}>{emp.salary} Kč</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{...tdStyle, textAlign: "center", color: "#888"}}>
                                        Zatím žádní zaměstnanci.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const thStyle = {
    padding: "15px 20px",
    textAlign: "left",
    color: "#555",
    fontWeight: "600",
    fontSize: "14px",
    textTransform: "uppercase"
};

const tdStyle = {
    padding: "15px 20px",
    color: "#333",
    fontSize: "15px"
};