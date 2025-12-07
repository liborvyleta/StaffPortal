import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { User, Mail, DollarSign, Briefcase, Building, ArrowLeft } from "lucide-react";

export default function MyProfile() {
    const { user } = useAuth();
    const { slug } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:5083/api/employees/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Načítám profil...</div>;
    if (!profile) return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>Profil se nepodařilo načíst.</div>;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <Link to={`/portal/${slug}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", marginBottom: "20px", fontWeight: 500 }}>
                    <ArrowLeft size={18} /> Zpět na portál
                </Link>

                <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <div style={{ width: "80px", height: "80px", background: "#eff6ff", color: "#3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto" }}>
                            <User size={40} />
                        </div>
                        <h1 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "1.8rem" }}>{profile.firstName} {profile.lastName}</h1>
                        <p style={{ color: "#64748b", margin: 0 }}>{user?.email}</p>
                    </div>

                    <div style={{ display: "grid", gap: "20px" }}>
                        <InfoItem icon={<Briefcase />} label="Pozice" value={profile.position} />
                        <InfoItem icon={<Building />} label="Oddělení" value={profile.departmentName} />
                        <InfoItem icon={<DollarSign />} label="Plat" value={`${profile.salary.toLocaleString()} Kč`} highlight />
                        <InfoItem icon={<Mail />} label="Pracovní email" value={profile.email} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value, highlight }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
            <div style={{ color: "#94a3b8" }}>{icon}</div>
            <div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: "1.1rem", color: highlight ? "#10b981" : "#334155", fontWeight: 600 }}>{value}</div>
            </div>
        </div>
    );
}