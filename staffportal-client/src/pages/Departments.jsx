import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Trash2,
    Plus,
    Building2,
    ArrowLeft,
    Loader2,
    User,      // Přidáno
    LogOut     // Přidáno
} from "lucide-react";

export default function Departments() {
    const { slug } = useParams();
    // Nyní použijeme 'user' i 'logout'
    const { user, logout } = useAuth();

    // Stav aplikace
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDeptName, setNewDeptName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");
    const role = user?.role || "Admin"; // Zobrazení role

    // Načtení oddělení
    const loadDepartments = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:5083/api/departments", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDepartments(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Chyba při načítání oddělení:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]);

    // Přidání oddělení
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newDeptName.trim()) return;
        setSubmitting(true);

        try {
            const res = await fetch("http://localhost:5083/api/departments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newDeptName })
            });

            if (res.ok) {
                setNewDeptName("");
                loadDepartments();
            } else {
                alert("Chyba při vytváření oddělení.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Smazání oddělení
    const handleDelete = async (id) => {
        if (!window.confirm("Opravdu smazat toto oddělení?")) return;

        try {
            const res = await fetch(`http://localhost:5083/api/departments/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                loadDepartments();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
            {/* Navbar */}
            <nav style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <Link to={`/portal/${slug}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#1f4e79"} onMouseOut={e => e.target.style.color = "#64748b"}>
                        <ArrowLeft size={18} /> Zpět na přehled
                    </Link>
                    <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }}></div>
                    <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Building2 size={20} color="#1f4e79" />
                        Správa oddělení
                    </h2>
                </div>

                {/* Pravá část Navbaru - Uživatel a Odhlášení */}
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.9rem" }}>
                        <User size={16} />
                        <span>{role}</span>
                    </div>
                    <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s" }}>
                        <LogOut size={14} /> Odhlásit
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>

                {/* Formulář pro přidání */}
                <div style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "1.1rem", color: "#0f172a" }}>Nové oddělení</h3>
                    <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Název oddělení (např. IT, Marketing)"
                            value={newDeptName}
                            onChange={e => setNewDeptName(e.target.value)}
                            style={inputStyle}
                            required
                        />
                        <button type="submit" disabled={submitting} style={btnStyle}>
                            {submitting ? <Loader2 size={18} className="spin" /> : <Plus size={18} />}
                            Vytvořit
                        </button>
                    </form>
                </div>

                {/* Seznam oddělení */}
                <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Načítám oddělení...</div>
                    ) : departments.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Zatím žádná oddělení.</div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <tr>
                                <th style={thStyle}>Název oddělení</th>
                                <th style={{...thStyle, textAlign: "right", width: "100px"}}>Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {departments.map(dept => (
                                <tr key={dept.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{dept.name}</div>
                                    </td>
                                    <td style={{...tdStyle, textAlign: "right"}}>
                                        <button
                                            onClick={() => handleDelete(dept.id)}
                                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: "8px", borderRadius: "6px", transition: "background 0.2s" }}
                                            title="Smazat"
                                            onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
                                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Inline styly pro animaci loaderu */}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// Styly
const inputStyle = {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none"
};

const btnStyle = {
    padding: "10px 20px",
    background: "#1f4e79",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px"
};

const thStyle = {
    padding: "16px 24px",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "0.85rem",
    textTransform: "uppercase"
};

const tdStyle = {
    padding: "16px 24px",
    fontSize: "0.95rem"
};