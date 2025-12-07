import React, { useState } from "react";
import { X, Lock, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({ onClose }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5083/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Heslo úspěšně změněno!");
                onClose(); // Zavřít modal
            } else {
                toast.error(data.message || "Chyba při změně hesla.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Chyba serveru.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px", color: "#1e293b" }}>
                        <Lock size={20} /> Změna hesla
                    </h3>
                    <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={labelStyle}>Staré heslo</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Nové heslo</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={submitBtnStyle}>
                        {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                        Uložit nové heslo
                    </button>
                </form>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// Styly pro modal
const overlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000
};

const modalStyle = {
    background: "white", padding: "30px", borderRadius: "12px",
    width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const inputStyle = {
    width: "100%", padding: "10px", borderRadius: "6px",
    border: "1px solid #cbd5e1", boxSizing: "border-box", marginTop: "5px"
};

const labelStyle = { fontSize: "0.9rem", color: "#64748b", fontWeight: 500 };

const closeBtnStyle = {
    background: "transparent", border: "none", cursor: "pointer", color: "#64748b"
};

const submitBtnStyle = {
    marginTop: "10px", padding: "10px", background: "#1f4e79", color: "white",
    border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600,
    display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
};