import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Users,
    Building2,
    Newspaper,
    ArrowRight,
    CheckCircle,
    Layout,
    ShieldCheck
} from "lucide-react";

export default function HomeLanding() {
    const { user } = useAuth();

    // Dynamický odkaz na dashboard podle role
    const getDashboardLink = () => {
        if (!user) return "/login";
        if (user.role === "SuperAdmin") return "/superadmin";
        if (user.companySlug) return `/portal/${user.companySlug}`;
        return "/";
    };

    return (
        <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* NAVBAR */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 40px",
                background: "white",
                borderBottom: "1px solid #e2e8f0",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ background: "#1f4e79", color: "white", padding: "6px", borderRadius: "6px" }}>
                        <Layout size={24} />
                    </div>
                    <h2 style={{ color: "#1e293b", margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>StaffPortal</h2>
                </div>

                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    {user ? (
                        <>
                            <span style={{ color: "#64748b", fontSize: "0.9rem", marginRight: "10px" }}>
                                Vítejte, <strong>{user.email}</strong>
                            </span>
                            <Link to={getDashboardLink()} style={primaryBtnStyle}>
                                Vstoupit do portálu <ArrowRight size={16} />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={secondaryBtnStyle}>
                                Přihlášení
                            </Link>
                            <Link to="/contact" style={primaryBtnStyle}>
                                Registrace firmy
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <header style={{
                textAlign: "center",
                padding: "100px 20px",
                background: "linear-gradient(135deg, #1f4e79 0%, #3b82f6 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto" }}>
                    <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "20px", lineHeight: 1.1 }}>
                        Řízení firmy <br/> jednoduše a efektivně.
                    </h1>
                    <p style={{ fontSize: "1.25rem", opacity: 0.9, marginBottom: "40px", lineHeight: 1.6 }}>
                        StaffPortal je moderní platforma pro správu zaměstnanců, oddělení a firemní komunikace.
                        Vše na jednom místě, dostupné odkudkoliv.
                    </p>

                    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                        {!user && (
                            <Link to="/contact" style={heroBtnStyle}>
                                Začít zdarma
                            </Link>
                        )}
                        <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} style={heroBtnOutlineStyle}>
                            Zjistit více
                        </button>
                    </div>
                </div>

                {/* Dekorativní kruhy na pozadí */}
                <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
                <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "300px", height: "300px", background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
            </header>

            {/* FEATURES SECTION */}
            <section id="features" style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h2 style={{ color: "#1e293b", fontSize: "2.5rem", marginBottom: "15px" }}>Co StaffPortal umí?</h2>
                    <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Nástroje, které zjednoduší život vám i vašim zaměstnancům.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
                    <FeatureCard
                        icon={<Users size={32} color="#3b82f6" />}
                        title="Databáze zaměstnanců"
                        text="Mějte přehled o všech kolezích, jejich pozicích, kontaktech a platech na jednom místě."
                    />
                    <FeatureCard
                        icon={<Building2 size={32} color="#8b5cf6" />}
                        title="Správa oddělení"
                        text="Organizace firmy do přehledných struktur. Snadné přiřazování lidí do týmů."
                    />
                    <FeatureCard
                        icon={<ShieldCheck size={32} color="#10b981" />}
                        title="Bezpečný přístup"
                        text="Role-based přístup. Každý vidí jen to, co má. Data jsou šifrována."
                    />
                    <FeatureCard
                        icon={<Newspaper size={32} color="#f59e0b" />}
                        title="Firemní novinky"
                        text="Sdílejte důležité informace a oznámení s celou firmou okamžitě. (Coming soon)"
                    />
                </div>
            </section>

            {/* TRUST / ABOUT SECTION */}
            <section style={{ background: "#f1f5f9", padding: "80px 20px" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ color: "#1e293b", fontSize: "2rem", marginBottom: "30px" }}>Proč zvolit nás?</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", textAlign: "left" }}>
                        <TrustItem text="Rychlá implementace do 24h" />
                        <TrustItem text="Intuitivní rozhraní bez školení" />
                        <TrustItem text="Bezpečnost na prvním místě" />
                        <TrustItem text="Férová cena pro malé i velké" />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "60px 20px", marginTop: "auto" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
                    <div>
                        <h3 style={{ color: "white", display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                            <Layout size={20} /> StaffPortal
                        </h3>
                        <p style={{ maxWidth: "300px", lineHeight: "1.6" }}>
                            Moderní řešení pro moderní firmy. <br/>
                            Zjednodušujeme HR procesy.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: "white", marginBottom: "20px" }}>Odkazy</h4>
                        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            <li><Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Domů</Link></li>
                            <li><Link to="/contact" style={{ color: "inherit", textDecoration: "none" }}>Kontakt</Link></li>
                            <li><Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>Přihlášení</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: "white", marginBottom: "20px" }}>Kontakt</h4>
                        <p>info@staffportal.cz</p>
                        <p>+420 123 456 789</p>
                    </div>
                </div>
                <div style={{ borderTop: "1px solid #334155", marginTop: "40px", paddingTop: "20px", textAlign: "center", fontSize: "0.9rem" }}>
                    © {new Date().getFullYear()} StaffPortal. Všechna práva vyhrazena.
                </div>
            </footer>
        </div>
    );
}

// Sub-komponenty pro čistší kód
function FeatureCard({ icon, title, text }) {
    return (
        <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s",
            border: "1px solid #e2e8f0"
        }}
             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div style={{ marginBottom: "20px" }}>{icon}</div>
            <h3 style={{ color: "#1e293b", marginBottom: "10px", fontSize: "1.25rem" }}>{title}</h3>
            <p style={{ color: "#64748b", lineHeight: "1.6" }}>{text}</p>
        </div>
    );
}

function TrustItem({ text }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <CheckCircle size={20} color="#10b981" />
            <span style={{ color: "#334155", fontWeight: 500 }}>{text}</span>
        </div>
    );
}

// Styly
const primaryBtnStyle = {
    background: "#1f4e79",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s",
    border: "none",
    cursor: "pointer"
};

const secondaryBtnStyle = {
    color: "#1f4e79",
    textDecoration: "none",
    fontWeight: 600,
    padding: "10px 20px",
    transition: "color 0.2s"
};

const heroBtnStyle = {
    background: "white",
    color: "#1f4e79",
    padding: "14px 32px",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1.1rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    transition: "transform 0.2s"
};

const heroBtnOutlineStyle = {
    background: "transparent",
    color: "white",
    border: "2px solid rgba(255,255,255,0.3)",
    padding: "12px 32px",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.2s"
};