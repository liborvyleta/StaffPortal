import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError("Invalid email or password");
                return;
            }

            const data = await res.json();

            // Uložit token a user info do localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Získat role a případně přesměrovat
            const role = data.user.role;

            if (role === "SuperAdmin") {
                navigate("/superadmin");
            } else if (role === "CompanyAdmin") {
                navigate("/portal"); // později můžeš přidat /:slug
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error(err);
            setError("Server is unavailable");
        }
    };

    return (
        <div style={{
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #e8f0ff, #ffffff)"
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "400px",
                color: "#2c3e50",
                textAlign: "center"
            }}>
                <h2 style={{ marginBottom: "25px", color: "#1a73e8", fontWeight: "600", fontSize: "28px" }}>StaffPortal Login</h2>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: "1.5px solid #ccc",
                            fontSize: "16px",
                            color: "#2c3e50",
                            outline: "none",
                            transition: "border-color 0.3s ease"
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "#1a73e8"}
                        onBlur={e => e.currentTarget.style.borderColor = "#ccc"}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: "1.5px solid #ccc",
                            fontSize: "16px",
                            color: "#2c3e50",
                            outline: "none",
                            transition: "border-color 0.3s ease"
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "#1a73e8"}
                        onBlur={e => e.currentTarget.style.borderColor = "#ccc"}
                    />
                    <button type="submit" style={{
                        backgroundColor: "#1a73e8",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "16px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#155ab6"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1a73e8"}
                    >
                        Log in
                    </button>
                </form>
                {error && <p style={{ color: "#e74c3c", marginTop: "20px", fontWeight: "500" }}>{error}</p>}
            </div>
        </div>
    );
};

export default Login;