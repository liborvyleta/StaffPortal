import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
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
                // Použijeme login funkci z kontextu
                login(data.token, data.user);

                if (data.user.role === "SuperAdmin") {
                    navigate("/superadmin");
                } else if (data.user.companySlug) {
                    navigate(`/portal/${data.user.companySlug}`);
                } else {
                    setError("Chyba: Uživatel nemá přiřazenou firmu.");
                }
            } else {
                setError(data.message || "Přihlášení se nezdařilo");
            }
        } catch (err) {
            console.error(err);
            setError("Chyba serveru.");
        }
    };

    return (
        <div style={{
            height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
            background: "linear-gradient(135deg, #1f4e79, #3a7bd5)", fontFamily: "'Poppins', sans-serif"
        }}>
            <div style={{ background: "white", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "400px" }}>
                <h2 style={{ color: "#1f4e79", textAlign: "center" }}>Login</h2>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: "10px" }} />
                    <input type="password" placeholder="Heslo" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: "10px" }} />
                    <button type="submit" style={{ padding: "10px", background: "#1f4e79", color: "white", border: "none", cursor: "pointer" }}>Přihlásit</button>
                </form>
            </div>
        </div>
    );
}