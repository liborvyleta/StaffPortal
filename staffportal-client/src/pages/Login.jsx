import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5083/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Uložení tokenu a dat o uživateli
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);
                localStorage.setItem("userId", data.user.id);
                // Uložíme i slug pro pozdější kontrolu
                if (data.user.companySlug) {
                    localStorage.setItem("companySlug", data.user.companySlug);
                }

                // Logika přesměrování podle role
                if (data.user.role === "SuperAdmin") {
                    navigate("/superadmin");
                } else if (data.user.companySlug) {
                    // Přesměrování na unikátní URL firmy
                    navigate(`/portal/${data.user.companySlug}`);
                } else {
                    // Fallback, pokud uživatel nemá firmu (např. chyba dat)
                    navigate("/dashboard");
                }
            } else {
                setError(data.message || "Přihlášení se nezdařilo");
            }
        } catch (err) {
            console.error(err);
            setError("Chyba serveru. Běží backend?");
        }
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #1f4e79, #3a7bd5)",
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}>
                <h2 style={{ color: "#1f4e79", textAlign: "center", marginBottom: "20px" }}>
                    StaffPortal Login
                </h2>

                {error && (
                    <div style={{
                        background: "#ffebee",
                        color: "#c62828",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "15px",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Heslo</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                            required
                        />
                    </div>

                    <button type="submit" style={{
                        padding: "12px",
                        background: "#1f4e79",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginTop: "10px"
                    }}>
                        Přihlásit se
                    </button>
                </form>
            </div>
        </div>
    );
}