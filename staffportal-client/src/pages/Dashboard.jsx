import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5083/api/employees")
            .then((res) => res.json())
            .then((data) => {
                setEmployees(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading employees:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px", color: "#1f4e79" }}>
                <h2>Loading employees...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px", fontFamily: "Poppins, sans-serif" }}>
            <h1 style={{ color: "#1f4e79", textAlign: "center", marginBottom: "30px" }}>
                Employee Overview
            </h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <thead style={{ background: "#1f4e79", color: "white" }}>
                <tr>
                    <th style={{ padding: "12px" }}>Name</th>
                    <th style={{ padding: "12px" }}>Position</th>
                    <th style={{ padding: "12px" }}>Salary</th>
                    <th style={{ padding: "12px" }}>Department</th>
                </tr>
                </thead>
                <tbody>
                {employees.map((emp) => (
                    <tr key={emp.id} style={{ background: "#f8f9fa" }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{emp.name}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{emp.position}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                            {emp.salary.toLocaleString()} Kč
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                            {emp.departmentName || "—"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button
                    onClick={() => (window.location.href = "/")}
                    style={{
                        padding: "10px 25px",
                        background: "#1f4e79",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}