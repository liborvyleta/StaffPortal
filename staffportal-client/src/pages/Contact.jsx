import React, { useState } from "react";

export default function Contact() {
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5083/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyName, email, message }),
        });

        if (res.ok) {
            setSuccess(true);
            setCompanyName("");
            setEmail("");
            setMessage("");
        }
    };

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #e8f0ff, #ffffff)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Poppins, sans-serif",
                padding: "20px",
            }}
        >
            <div
                style={{
                    background: "white",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    borderRadius: "16px",
                    padding: "50px",
                    maxWidth: "500px",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <h1 style={{ color: "#1f4e79", marginBottom: "10px" }}>
                    Request Access to StaffPortal
                </h1>
                <p style={{ color: "#555", marginBottom: "30px" }}>
                    Fill out the form below and our team will contact you to set up your
                    company account.
                </p>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        textAlign: "left",
                    }}
                >
                    <label style={{ color: "#1f4e79", fontWeight: 500 }}>Company Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Vyleta Software s.r.o."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccd5e0",
                            outlineColor: "#1f4e79",
                        }}
                    />

                    <label style={{ color: "#1f4e79", fontWeight: 500 }}>Contact Email</label>
                    <input
                        type="email"
                        placeholder="e.g. info@vyletasoftware.cz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccd5e0",
                            outlineColor: "#1f4e79",
                        }}
                    />

                    <label style={{ color: "#1f4e79", fontWeight: 500 }}>Message</label>
                    <textarea
                        placeholder="Tell us about your company..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccd5e0",
                            outlineColor: "#1f4e79",
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            marginTop: "10px",
                            padding: "12px 20px",
                            background: "#1f4e79",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            fontWeight: 500,
                        }}
                        onMouseOver={(e) => (e.target.style.background = "#2f65a2")}
                        onMouseOut={(e) => (e.target.style.background = "#1f4e79")}
                    >
                        Send Request
                    </button>

                    {success && (
                        <p style={{ color: "green", textAlign: "center", marginTop: "15px" }}>
                            ✅ Your request has been sent successfully!
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}