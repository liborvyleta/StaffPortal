import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function CompanyPortal() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]); // NOVÉ: Seznam oddělení
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", position: "", salary: "", email: "", password: "", departmentId: ""
    });

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // Načtení zaměstnanců
    const loadEmployees = useCallback(() => {
        fetch("http://localhost:5083/api/employees", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setEmployees(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [token]);

    // NOVÉ: Načtení oddělení pro select box
    const loadDepartments = useCallback(() => {
        fetch("http://localhost:5083/api/departments", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDepartments(data);
            })
            .catch(console.error);
    }, [token]);

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        loadEmployees();
        loadDepartments(); // Voláme i načtení oddělení
    }, [slug, token, navigate, loadEmployees, loadDepartments]);

    const handleEditClick = (emp) => {
        setEditingId(emp.id);
        setFormData({
            firstName: emp.firstName,
            lastName: emp.lastName,
            position: emp.position,
            salary: emp.salary,
            email: emp.email,
            password: "",
            departmentId: emp.departmentId || "" // Naplníme select
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
                alert(editingId ? "Uloženo!" : "Vytvořeno!");
                handleCancelEdit();
                loadEmployees();
            } else {
                alert("Chyba při ukládání.");
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Smazat?")) return;
        await fetch(`http://localhost:5083/api/employees/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        loadEmployees();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f4f7f6", minHeight: "100vh" }}>
            <nav style={{ background: "#1f4e79", color: "white", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>{slug} Portal</h2>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    {role === "CompanyAdmin" && (
                        <Link to={`/portal/${slug}/departments`} style={{ color: "white", textDecoration: "underline" }}>Správa oddělení</Link>
                    )}
                    <span>👤 {role}</span>
                    <button onClick={handleLogout} style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Odhlásit</button>
                </div>
            </nav>

            <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>

                {role === "CompanyAdmin" && (
                    <div style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", borderLeft: editingId ? "5px solid #ff9800" : "5px solid #28a745" }}>
                        <h3 style={{ marginTop: 0, color: "#1f4e79" }}>{editingId ? "Upravit zaměstnance" : "Přidat zaměstnance"}</h3>
                        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <input type="text" placeholder="Jméno" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Příjmení" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Pozice" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required style={inputStyle} />
                            <input type="number" placeholder="Plat" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required style={inputStyle} />
                            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} />

                            {/* NOVÉ: Výběr oddělení */}
                            <select
                                value={formData.departmentId}
                                onChange={e => setFormData({...formData, departmentId: e.target.value})}
                                style={inputStyle}
                            >
                                <option value="">-- Vyberte oddělení --</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>

                            {!editingId && <input type="password" placeholder="Heslo" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={inputStyle} />}

                            <div style={{ width: "100%", display: "flex", gap: "10px" }}>
                                <button type="submit" style={{ ...btnStyle, background: editingId ? "#ff9800" : "#28a745" }}>{editingId ? "Uložit" : "Vytvořit"}</button>
                                {editingId && <button type="button" onClick={handleCancelEdit} style={{ ...btnStyle, background: "#6c757d" }}>Zrušit</button>}
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h1>Seznam zaměstnanců</h1>
                    <input type="text" placeholder="Hledat..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }} />
                </div>

                {/* Tabulka */}
                <div style={{ background: "white", borderRadius: "10px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: "#eee" }}>
                        <tr>
                            <th style={thStyle}>Jméno</th>
                            <th style={thStyle}>Pozice</th>
                            <th style={thStyle}>Oddělení</th>
                            <th style={thStyle}>Email</th>
                            {role === "CompanyAdmin" && <th style={thStyle}>Plat</th>}
                            {role === "CompanyAdmin" && <th style={thStyle}>Akce</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id} style={{ borderBottom: "1px solid #eee", background: editingId === emp.id ? "#fff3e0" : "white" }}>
                                <td style={tdStyle}><strong>{emp.firstName} {emp.lastName}</strong></td>
                                <td style={tdStyle}>{emp.position}</td>
                                <td style={tdStyle}>{emp.departmentName || "—"}</td>
                                <td style={tdStyle}>{emp.email}</td>
                                {role === "CompanyAdmin" && <td style={tdStyle}>{Number(emp.salary).toLocaleString()} Kč</td>}
                                {role === "CompanyAdmin" && (
                                    <td style={tdStyle}>
                                        <button onClick={() => handleEditClick(emp)} style={{ marginRight: "10px", cursor: "pointer" }}>✏️</button>
                                        <button onClick={() => handleDeleteEmployee(emp.id)} style={{ color: "red", cursor: "pointer" }}>🗑️</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", flex: "1 1 150px" };
const btnStyle = { padding: "10px 20px", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const thStyle = { padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px" };