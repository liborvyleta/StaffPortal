import React, {useState} from "react";

export default function RegisterCompany() {
    const [form, setForm] = useState({name: "", email: "", domain: ""});
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("http://localhost:5083/api/companies/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus("success");
                setForm({name: "", email: "", domain: ""});
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <div
            style={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(135deg, #1f4e79, #3a7bd5)",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "40px 50px",
                    width: "400px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{color: "#1f4e79", textAlign: "center", marginBottom: "30px"}}>
                    Register Your Company
                </h2>

                <form onSubmit={handleSubmit}>
                    <label style={{display: "block", marginBottom: "10px"}}>
                        Company Name
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                marginBottom: "15px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </label>

                    <label style={{display: "block", marginBottom: "10px"}}>
                        Company Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                marginBottom: "15px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </label>

                    <label style={{display: "block", marginBottom: "10px"}}>
                        Company Domain (optional)
                        <input
                            type="text"
                            name="domain"
                            value={form.domain}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                marginBottom: "20px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </label>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "#1f4e79",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 20px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#3a7bd5")}
                        onMouseLeave={(e) => (e.target.style.background = "#1f4e79")}
                    >
                        {status === "loading" ? "Registering..." : "Create Company"}
                    </button>
                </form>

                {status === "success" && (
                    <p
                        style={{
                            color: "green",
                            textAlign: "center",
                            marginTop: "20px",
                            fontWeight: 500,
                        }}
                    >
                        ✅ Company successfully registered!
                    </p>
                )}
                {status === "error" && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center",
                            marginTop: "20px",
                            fontWeight: 500,
                        }}
                    >
                        ❌ Something went wrong. Try again.
                    </p>
                )}
            </div>
        </div>
    );
}