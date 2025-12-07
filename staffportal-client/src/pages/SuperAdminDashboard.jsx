import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Check, X, ShieldAlert, Building2, Mail, Loader2, LogOut,
    Users, Trash2, Plus, ChevronDown, ChevronUp
} from "lucide-react";

export default function SuperAdminDashboard() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState("requests"); // 'requests' | 'companies'

    // --- STATE PRO ŽÁDOSTI ---
    const [requests, setRequests] = useState([]);
    const [loadingReq, setLoadingReq] = useState(false);

    // --- STATE PRO FIRMY ---
    const [companies, setCompanies] = useState([]);
    const [loadingComp, setLoadingComp] = useState(false);
    const [expandedCompanyId, setExpandedCompanyId] = useState(null); // Která firma je rozbalená
    const [companyUsers, setCompanyUsers] = useState([]); // Uživatelé rozbalené firmy
    const [loadingUsers, setLoadingUsers] = useState(false);

    // --- STATE PRO FORMULÁŘ ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ email: "", password: "", role: "CompanyAdmin", companyId: "" });

    // Načtení dat podle tabu
    useEffect(() => {
        if (activeTab === "requests") loadRequests();
        if (activeTab === "companies") loadCompanies();
    }, [activeTab]);

    // --- API VOLÁNÍ: ŽÁDOSTI ---
    const loadRequests = async () => {
        setLoadingReq(true);
        try {
            const res = await fetch("http://localhost:5083/api/superadmin/requests");
            if (res.ok) setRequests(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoadingReq(false); }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Schválit tuto firmu?")) return;
        await fetch(`http://localhost:5083/api/superadmin/approve/${id}`, { method: "POST" });
        loadRequests();
    };

    const handleReject = async (id) => {
        if (!window.confirm("Smazat žádost?")) return;
        await fetch(`http://localhost:5083/api/superadmin/reject/${id}`, { method: "DELETE" });
        loadRequests();
    };

    // --- API VOLÁNÍ: FIRMY A UŽIVATELÉ ---
    const loadCompanies = async () => {
        setLoadingComp(true);
        try {
            const res = await fetch("http://localhost:5083/api/superadmin/companies");
            if (res.ok) setCompanies(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoadingComp(false); }
    };

    const loadUsersForCompany = async (companyId) => {
        setLoadingUsers(true);
        try {
            const res = await fetch(`http://localhost:5083/api/superadmin/company/${companyId}/users`);
            if (res.ok) setCompanyUsers(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoadingUsers(false); }
    };

    const toggleCompany = (companyId) => {
        if (expandedCompanyId === companyId) {
            setExpandedCompanyId(null);
        } else {
            setExpandedCompanyId(companyId);
            loadUsersForCompany(companyId);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Opravdu smazat tohoto uživatele? Přístup bude zrušen.")) return;
        await fetch(`http://localhost:5083/api/superadmin/users/${userId}`, { method: "DELETE" });
        loadUsersForCompany(expandedCompanyId); // Refresh seznamu
    };

    // NOVÁ FUNKCE: Smazání celé firmy
    const handleDeleteCompany = async (companyId, companyName) => {
        if (!window.confirm(`POZOR: Opravdu smazat firmu "${companyName}"?\n\nSmažou se i všichni její uživatelé!`)) return;

        try {
            const res = await fetch(`http://localhost:5083/api/superadmin/companies/${companyId}`, { method: "DELETE" });
            if (res.ok) {
                if (expandedCompanyId === companyId) setExpandedCompanyId(null);
                loadCompanies(); // Aktualizujeme seznam
                alert("Firma byla smazána.");
            }
        } catch (e) { console.error(e); }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5083/api/superadmin/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newUserForm, companyId: expandedCompanyId })
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewUserForm({ email: "", password: "", role: "CompanyAdmin", companyId: "" });
                loadUsersForCompany(expandedCompanyId);
                alert("Uživatel přidán.");
            } else {
                alert("Chyba při vytváření (možná email již existuje).");
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
            {/* Navbar */}
            <nav style={{ background: "#1e293b", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldAlert size={24} className="text-blue-400" />
                    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>SuperAdmin</h2>
                </div>
                <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
                    <LogOut size={16} /> Odhlásit
                </button>
            </nav>

            <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>

                {/* Přepínač Záložek */}
                <div style={{ display: "flex", gap: "20px", marginBottom: "30px", borderBottom: "1px solid #e2e8f0" }}>
                    <TabButton active={activeTab === "requests"} onClick={() => setActiveTab("requests")} icon={<Mail size={18} />} label="Žádosti o registraci" />
                    <TabButton active={activeTab === "companies"} onClick={() => setActiveTab("companies")} icon={<Building2 size={18} />} label="Správa Firem a Uživatelů" />
                </div>

                {/* OBSAH: ŽÁDOSTI */}
                {activeTab === "requests" && (
                    <div style={cardStyle}>
                        {loadingReq ? <p style={{padding:20}}>Načítám...</p> : requests.length === 0 ? <p style={{padding:20}}>Žádné čekající žádosti.</p> : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={tdStyle}><strong>{req.companyName}</strong><br/><span style={{fontSize: "0.85rem", color:"#64748b"}}>{req.email}</span></td>
                                        <td style={tdStyle}>{req.message}</td>
                                        <td style={{...tdStyle, textAlign: "right"}}>
                                            <button onClick={() => handleApprove(req.id)} style={{...btnStyle, background: "#dcfce7", color: "#16a34a"}}><Check size={18}/></button>
                                            <button onClick={() => handleReject(req.id)} style={{...btnStyle, background: "#fee2e2", color: "#dc2626", marginLeft: 10}}><X size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* OBSAH: FIRMY */}
                {activeTab === "companies" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {loadingComp ? <p>Načítám firmy...</p> : companies.map(comp => (
                            <div key={comp.id} style={cardStyle}>
                                <div
                                    onClick={() => toggleCompany(comp.id)}
                                    style={{ padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: expandedCompanyId === comp.id ? "#f1f5f9" : "white" }}
                                >
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>{comp.name}</h3>
                                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{comp.email} • /portal/{comp.slug}</span>
                                    </div>

                                    {/* UPRAVENÁ HLAVIČKA S TLAČÍTKEM SMAZAT */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCompany(comp.id, comp.name);
                                            }}
                                            title="Smazat celou firmu"
                                            style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                        {expandedCompanyId === comp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {/* Detail firmy - seznam uživatelů */}
                                {expandedCompanyId === comp.id && (
                                    <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0", background: "#fafafa" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                            <h4 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}><Users size={18}/> Uživatelé</h4>
                                            <button
                                                onClick={() => setShowAddModal(true)}
                                                style={{ background: "#3b82f6", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem" }}
                                            >
                                                <Plus size={16}/> Přidat uživatele
                                            </button>
                                        </div>

                                        {loadingUsers ? <Loader2 className="spin" /> : (
                                            <table style={{ width: "100%", fontSize: "0.9rem" }}>
                                                <thead>
                                                <tr style={{textAlign: "left", color: "#64748b"}}><th>Email</th><th>Role</th><th>Akce</th></tr>
                                                </thead>
                                                <tbody>
                                                {companyUsers.map(u => (
                                                    <tr key={u.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                                        <td style={{ padding: "10px 0" }}>{u.email}</td>
                                                        <td>
                                                                <span style={{
                                                                    background: u.role === "CompanyAdmin" ? "#e0e7ff" : "#f1f5f9",
                                                                    color: u.role === "CompanyAdmin" ? "#4338ca" : "#475569",
                                                                    padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600
                                                                }}>
                                                                    {u.role}
                                                                </span>
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                                                                title="Smazat uživatele"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL PRO PŘIDÁNÍ UŽIVATELE */}
            {showAddModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Přidat uživatele do firmy</h3>
                        <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <input
                                type="email" placeholder="Email" required
                                value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})}
                                style={inputStyle}
                            />
                            <input
                                type="password" placeholder="Heslo" required
                                value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})}
                                style={inputStyle}
                            />
                            <select
                                value={newUserForm.role} onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}
                                style={inputStyle}
                            >
                                <option value="CompanyAdmin">Company Admin</option>
                                <option value="User">User</option>
                            </select>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button type="submit" style={{ ...btnStyle, background: "#3b82f6", color: "white", flex: 1 }}>Vytvořit</button>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ ...btnStyle, background: "#cbd5e1", color: "#334155", flex: 1 }}>Zrušit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// STYLY A KOMPONENTY
const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", border: "none", background: "transparent",
            borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
            color: active ? "#3b82f6" : "#64748b", fontWeight: active ? 600 : 400,
            cursor: "pointer", transition: "all 0.2s"
        }}
    >
        {icon} {label}
    </button>
);

const cardStyle = { background: "white", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", overflow: "hidden" };
const tdStyle = { padding: "16px 24px" };
const btnStyle = { padding: "8px 12px", borderRadius: "6px", cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 };
const modalContentStyle = { background: "white", padding: "30px", borderRadius: "12px", width: "400px", maxWidth: "90%" };
const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100%", boxSizing: "border-box" };