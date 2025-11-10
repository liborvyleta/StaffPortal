import React from "react";

export default function HomeLanding() {
    return (
        <div
            style={{
                fontFamily: "'Poppins', 'Inter', sans-serif",
                background: "#f8fafc",
                margin: 0,
                padding: 0,
            }}
        >
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 60px",
                    background: "white",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                <h2 style={{ color: "#1f4e79", margin: 0 }}>StaffPortal</h2>

                {/* Wrapper pro tlačítka */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        style={{
                            background: "#1f4e79",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            fontWeight: 500,
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#3a7bd5")}
                        onMouseLeave={(e) => (e.target.style.background = "#1f4e79")}
                        onClick={() => (window.location.href = "/dashboard")}
                    >
                        Enter Portal
                    </button>

                    <button
                        style={{
                            background: "#1f4e79",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            fontWeight: 500,
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#3a7bd5")}
                        onMouseLeave={(e) => (e.target.style.background = "#1f4e79")}
                        onClick={() => (window.location.href = "/login")}
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section
                style={{
                    textAlign: "center",
                    padding: "120px 20px 100px 20px",
                    background: "linear-gradient(135deg, #1f4e79, #3a7bd5)",
                    color: "white",
                }}
            >
                <h1 style={{fontSize: "3.5rem", marginBottom: "20px", fontWeight: 700}}>
                    Empower Your Workplace
                </h1>
                <p
                    style={{
                        fontSize: "1.2rem",
                        maxWidth: "650px",
                        margin: "0 auto 40px auto",
                        lineHeight: "1.6",
                    }}
                >
                    StaffPortal is your company’s all-in-one platform for employee
                    management, collaboration, and communication.
                </p>
                <button
                    style={{
                        background: "white",
                        color: "#1f4e79",
                        border: "none",
                        padding: "15px 40px",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
                    onClick={() => (window.location.href = "/contact")}
                >
                    Get Started
                </button>
            </section>

            {/* FEATURES SECTION */}
            <section
                style={{
                    padding: "80px 40px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <h2 style={{color: "#1f4e79", marginBottom: "10px"}}>What You Can Do</h2>
                <p style={{color: "#555", marginBottom: "50px"}}>
                    Manage employees, track attendance, and stay connected with your company.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "30px",
                    }}
                >
                    {[
                        {
                            icon: "👥",
                            title: "Employee Overview",
                            text: "See all employee information in one place, with departments, positions and salary details.",
                        },
                        {
                            icon: "🗂️",
                            title: "Departments",
                            text: "Organize your company structure with clear department management and hierarchy.",
                        },
                        {
                            icon: "📰",
                            title: "Company News",
                            text: "Stay updated with important announcements and team news, right inside the portal.",
                        },
                        {
                            icon: "📅",
                            title: "Absences & Vacations",
                            text: "Track employee availability, absences and planned holidays with ease.",
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            style={{
                                background: "white",
                                borderRadius: "16px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                padding: "30px",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
                            }}
                        >
                            <div style={{fontSize: "2.5rem"}}>{f.icon}</div>
                            <h3 style={{color: "#1f4e79", marginTop: "10px"}}>{f.title}</h3>
                            <p style={{color: "#666"}}>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section
                style={{
                    background: "#eef3f8",
                    padding: "100px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={{color: "#1f4e79", marginBottom: "20px"}}>Built for Modern Teams</h2>
                <p
                    style={{
                        color: "#444",
                        maxWidth: "700px",
                        margin: "0 auto",
                        lineHeight: "1.6",
                    }}
                >
                    StaffPortal is designed for organizations that value efficiency,
                    collaboration, and transparency. Whether you’re managing 10 or 1000
                    employees, everything you need is right here.
                </p>
            </section>

            {/* FOOTER */}
            <footer
                style={{
                    background: "#1f4e79",
                    color: "white",
                    textAlign: "center",
                    padding: "40px",
                }}
            >
                <p style={{margin: 0}}>
                    © {new Date().getFullYear()} StaffPortal — Empowering your workplace.
                </p>
            </footer>
        </div>
    );
}