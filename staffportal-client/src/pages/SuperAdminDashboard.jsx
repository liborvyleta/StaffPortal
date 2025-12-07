import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Check,
    X,
    ShieldAlert,
    Building2,
    Mail,
    CalendarClock,
    Loader2,
    LogOut
} from "lucide-react";

export default function SuperAdminDashboard() {
    const { logout } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const loadRequests = async () => {
        try {
            const res = await fetch("http://localhost:5083/api/superadmin/requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm("Schválit tuto firmu a vytvořit přístup?")) return;
        setProcessingId(id);
        try {
            const res = await fetch(`http://localhost:5083/api/superadmin/approve/${id}`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                alert(`Firma vytvořena!\nAdmin: ${data.adminUsername}\nHeslo: ${data.tempPassword}`);
                loadRequests();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Zamítnout a smazat žádost?")) return;
        setProcessingId(id);
        try {
            const res = await fetch(`http://localhost:5083/api/superadmin/reject/${id}`, { method: "DELETE" });
            if (res.ok) loadRequests();
        } catch (e) {
            console.error(e);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
            {/* Navbar */}
            <nav style={{ background: "#1e293b", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldAlert size={24} className="text-blue-400" />
                    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>SuperAdmin <span style={{ opacity: 0.7, fontWeight: 400 }}>Panel</span></h2>
                </div>
                <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" }}>
                    <LogOut size={16} /> Odhlásit
                </button>
            </nav>

            <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
                <div style={{ marginBottom: "30px" }}>
                    <h1 style={{ fontSize: "1.8rem", color: "#0f172a", marginBottom: "10px" }}>Žádosti o registraci</h1>
                    <p style={{ color: "#64748b" }}>Čekající žádosti firem o přístup do systému.</p>
                </div>

                <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>Načítám žádosti...</div>
                    ) : requests.length === 0 ? (
                        <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>
                            <Check size={48} style={{ marginBottom: "15px", color: "#10b981" }} />
                            <p>Vše hotovo! Žádné čekající žádosti.</p>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <tr>
                                <th style={thStyle}>Firma</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Zpráva</th>
                                <th style={thStyle}>Datum</th>
                                <th style={{...thStyle, textAlign: "right"}}>Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map(req => (
                                <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, color: "#0f172a" }}>
                                            <Building2 size={18} color="#64748b" /> {req.companyName}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569" }}>
                                            <Mail size={16} /> {req.email}
                                        </div>
                                    </td>
                                    <td style={{...tdStyle, color: "#64748b", fontStyle: "italic", maxWidth: "300px"}}>
                                        "{req.message}"
                                    </td>
                                    <td style={{...tdStyle, color: "#94a3b8", fontSize: "0.85rem"}}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <CalendarClock size={14} />
                                            {new Date(req.submittedAt).toLocaleDateString("cs-CZ")}
                                        </div>
                                    </td>
                                    <td style={{...tdStyle, textAlign: "right"}}>
                                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                disabled={processingId === req.id}
                                                title="Schválit"
                                                style={{ ...actionBtnStyle, background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}
                                            >
                                                {processingId === req.id ? <Loader2 size={18} className="spin" /> : <Check size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                disabled={processingId === req.id}
                                                title="Zamítnout"
                                                style={{ ...actionBtnStyle, background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

const thStyle = { padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase" };
const tdStyle = { padding: "16px 24px", fontSize: "0.95rem" };
const actionBtnStyle = { padding: "8px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" };