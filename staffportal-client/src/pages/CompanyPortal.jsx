import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ujisti se, že importuješ kontext správně
import {
    Pencil,
    Trash2,
    Search,
    UserPlus,
    Briefcase,
    Save,
    X,
    LogOut,
    User
} from "lucide-react";

export default function CompanyPortal() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Použití AuthContextu pro data uživatele a logout

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", position: "", salary: "", email: "", password: "", departmentId: ""
    });

    const token = localStorage.getItem("token");
    // Pokud používáš AuthContext, 'role' by měla být v objektu 'user'.
    // Pro zpětnou kompatibilitu s tvým předchozím kódem necháme i localStorage fallback.
    const role = user?.role || localStorage.getItem("role");

    // Načtení dat
    const loadData = useCallback(async () => {
        try {
            const headers = { "Authorization": `Bearer ${token}` };

            const [empRes, depRes] = await Promise.all([
                fetch("http://localhost:5083/api/employees", { headers }),
                fetch("http://localhost:5083/api/departments", { headers })
            ]);

            if (empRes.ok) {
                const empData = await empRes.json();
                setEmployees(Array.isArray(empData) ? empData : []);
            }

            if (depRes.ok) {
                const depData = await depRes.json();
                setDepartments(Array.isArray(depData) ? depData : []);
            }
        } catch (err) {
            console.error("Chyba při načítání dat:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        loadData();
    }, [slug, token, navigate, loadData]);

    // Handlery
    const handleEditClick = (emp) => {
        setEditingId(emp.id);
        setFormData({
            firstName: emp.firstName,
            lastName: emp.lastName,
            position: emp.position,
            salary: emp.salary,
            email: emp.email,
            password: "", // Heslo při editaci nevyplňujeme, pokud se nemění
            departmentId: emp.departmentId || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ firstName: "", lastName: "", position: "", salary: "", email: "", password: "", departmentId: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `http://localhost:5083/api/employees/${editingId}`
            : "http://localhost:5083/api/employees";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Místo alertu můžeš použít toast notifikaci, ale alert stačí pro teď
                // alert(editingId ? "Uloženo!" : "Vytvořeno!");
                handleCancelEdit();
                loadData();
            } else {
                const errData = await res.json();
                alert("Chyba: " + (errData.message || "Nepodařilo se uložit"));
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Opravdu smazat tohoto zaměstnance?")) return;
        try {
            const res = await fetch(`http://localhost:5083/api/employees/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) loadData();
        } catch (e) { console.error(e); }
    };

    // Filtrace
    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: "#f8fafc", minHeight: "100vh", paddingBottom: "40px" }}>
            {/* Navbar */}
            <nav style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ background: "#1f4e79", color: "white", padding: "8px", borderRadius: "6px" }}>
                        <Briefcase size={20} />
                    </div>
                    <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>{slug} <span style={{ fontWeight: "normal", color: "#64748b" }}>Portal</span></h2>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    {role === "CompanyAdmin" && (
                        <Link to={`/portal/${slug}/departments`} style={{ color: "#1f4e79", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>
                            Správa oddělení
                        </Link>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.9rem" }}>
                        <User size={16} />
                        <span>{role}</span>
                    </div>
                    <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s" }}>
                        <LogOut size={14} /> Odhlásit
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>

                {/* Form Section */}
                {role === "CompanyAdmin" && (
                    <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", marginBottom: "40px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                            <div style={{ background: editingId ? "#fff7ed" : "#f0fdf4", padding: "8px", borderRadius: "50%", color: editingId ? "#ea580c" : "#16a34a" }}>
                                {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
                            </div>
                            <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>
                                {editingId ? "Upravit údaje zaměstnance" : "Přidat nového zaměstnance"}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                            <input type="text" placeholder="Jméno" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Příjmení" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Pozice" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required style={inputStyle} />
                            <input type="number" placeholder="Plat (Kč)" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required style={inputStyle} />
                            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} />

                            <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} style={inputStyle}>
                                <option value="">-- Vyberte oddělení --</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>

                            {!editingId && (
                                <input type="password" placeholder="Heslo" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={inputStyle} />
                            )}

                            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button type="submit" style={{ ...btnStyle, background: editingId ? "#f97316" : "#1f4e79", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Save size={18} /> {editingId ? "Uložit změny" : "Vytvořit zaměstnance"}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancelEdit} style={{ ...btnStyle, background: "white", color: "#64748b", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <X size={18} /> Zrušit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* List Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h1 style={{ color: "#0f172a", fontSize: "1.8rem", margin: "0 0 5px 0", fontWeight: 700 }}>Zaměstnanci</h1>
                        <p style={{ margin: 0, color: "#64748b" }}>Celkem {filteredEmployees.length} zaměstnanců</p>
                    </div>

                    <div style={{ position: "relative", minWidth: "300px" }}>
                        <Search size={18} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input
                            type="text"
                            placeholder="Hledat jméno, pozici..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: "45px", width: "100%", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={thStyle}>Jméno</th>
                            <th style={thStyle}>Pozice</th>
                            <th style={thStyle}>Oddělení</th>
                            <th style={thStyle}>Email</th>
                            {role === "CompanyAdmin" && <th style={thStyle}>Plat</th>}
                            {role === "CompanyAdmin" && <th style={{...thStyle, textAlign: "right", paddingRight: "30px"}}>Akce</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Načítám data...</td></tr>
                        ) : filteredEmployees.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Nenalezeni žádní zaměstnanci.</td></tr>
                        ) : (
                            filteredEmployees.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} className="hover-row">
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{emp.firstName} {emp.lastName}</div>
                                    </td>
                                    <td style={tdStyle}>
                                            <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 500 }}>
                                                {emp.position}
                                            </span>
                                    </td>
                                    <td style={{...tdStyle, color: "#475569"}}>{emp.departmentName || "—"}</td>
                                    <td style={{...tdStyle, color: "#64748b"}}>{emp.email}</td>
                                    {role === "CompanyAdmin" && <td style={{...tdStyle, fontFamily: "monospace", color: "#0f172a"}}>{Number(emp.salary).toLocaleString()} Kč</td>}
                                    {role === "CompanyAdmin" && (
                                        <td style={{...tdStyle, textAlign: "right", paddingRight: "20px"}}>
                                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                <button
                                                    onClick={() => handleEditClick(emp)}
                                                    title="Upravit"
                                                    style={iconBtnStyle}
                                                    onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEmployee(emp.id)}
                                                    title="Smazat"
                                                    style={{...iconBtnStyle, color: "#ef4444"}}
                                                    onMouseOver={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Styly
const inputStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box"
};

const btnStyle = {
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "transform 0.1s, opacity 0.2s"
};

const thStyle = {
    padding: "16px 24px",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
};

const tdStyle = {
    padding: "16px 24px",
    fontSize: "0.95rem"
};

const iconBtnStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    color: "#64748b",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};