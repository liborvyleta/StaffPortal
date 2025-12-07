import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Building, MessageSquare, Send, CheckCircle, ArrowLeft } from "lucide-react";

export default function Contact() {
    const [formData, setFormData] = useState({ companyName: "", email: "", message: "" });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5083/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) setSuccess(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
            <nav style={{ padding: "20px 40px" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#64748b", fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Zpět na domů
                </Link>
            </nav>

            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <div style={{ background: "white", padding: "50px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", width: "100%", maxWidth: "500px" }}>

                    {success ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <CheckCircle size={64} color="#10b981" style={{ marginBottom: "20px" }} />
                            <h2 style={{ color: "#0f172a", marginBottom: "10px" }}>Žádost odeslána!</h2>
                            <p style={{ color: "#64748b", lineHeight: "1.6" }}>Děkujeme za váš zájem. Náš tým vás bude brzy kontaktovat na uvedený email s přístupovými údaji.</p>
                            <Link to="/" style={{ display: "inline-block", marginTop: "30px", color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>Zpět na úvod</Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                                <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>Začněte se StaffPortal</h1>
                                <p style={{ color: "#64748b" }}>Vyplňte formulář a založte si firemní účet.</p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div>
                                    <label style={labelStyle}>Název firmy</label>
                                    <div style={inputWrapperStyle}>
                                        <Building size={18} color="#94a3b8" />
                                        <input type="text" placeholder="Moje Firma s.r.o." required
                                               value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                                               style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Email administrátora</label>
                                    <div style={inputWrapperStyle}>
                                        <Mail size={18} color="#94a3b8" />
                                        <input type="email" placeholder="admin@mojefirma.cz" required
                                               value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                               style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Zpráva (nepovinné)</label>
                                    <div style={{...inputWrapperStyle, alignItems: "flex-start", paddingTop: "12px"}}>
                                        <MessageSquare size={18} color="#94a3b8" style={{ marginTop: "3px" }} />
                                        <textarea placeholder="Počet zaměstnanců, speciální požadavky..." rows="3"
                                                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                                                  style={{...inputStyle, resize: "none"}} />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} style={submitBtnStyle}>
                                    {loading ? "Odesílám..." : <><Send size={18} /> Odeslat žádost</>}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const labelStyle = { display: "block", marginBottom: "8px", color: "#334155", fontWeight: 500, fontSize: "0.9rem" };
const inputWrapperStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", transition: "border-color 0.2s" };
const inputStyle = { width: "100%", padding: "12px 0", border: "none", outline: "none", fontSize: "1rem", color: "#0f172a" };
const submitBtnStyle = { marginTop: "10px", padding: "14px", background: "#1f4e79", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "background 0.2s" };