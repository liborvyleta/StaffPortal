import React, {useEffect, useState} from "react";

export default function SuperAdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadRequests = async () => {
        setLoading(true);
        const res = await fetch("http://localhost:5083/api/superadmin/requests");
        const data = await res.json();
        setRequests(data);
        setLoading(false);
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this company request?")) return;
        const res = await fetch(`http://localhost:5083/api/superadmin/approve/${id}`, {
            method: "POST",
        });
        const data = await res.json();
        setMessage(data.message);
        await loadRequests();
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject and delete this request?")) return;
        const res = await fetch(`http://localhost:5083/api/superadmin/reject/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        setMessage(data.message);
        await loadRequests();
    };

    useEffect(() => {
        loadRequests();
    }, []);

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #e8f0ff, #ffffff)",
                minHeight: "100vh",
                padding: "50px",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <div style={{maxWidth: "1000px", margin: "0 auto"}}>
                <h1 style={{color: "#1f4e79", textAlign: "center", marginBottom: "40px"}}>
                    SuperAdmin Dashboard
                </h1>

                {message && (
                    <div
                        style={{
                            background: "#d4edda",
                            color: "#155724",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </div>
                )}

                {loading ? (
                    <p style={{textAlign: "center"}}>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p style={{textAlign: "center", color: "#777"}}>
                        No pending requests found.
                    </p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                            borderRadius: "12px",
                            overflow: "hidden",
                        }}
                    >
                        <thead style={{background: "#1f4e79", color: "white"}}>
                        <tr>
                            <th style={thStyle}>Company</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Message</th>
                            <th style={thStyle}>Submitted</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((r) => (
                            <tr key={r.id} style={{background: "#f9fafb"}}>
                                <td style={tdStyle}>{r.companyName}</td>
                                <td style={tdStyle}>{r.email}</td>
                                <td style={tdStyle}>{r.message}</td>
                                <td style={tdStyle}>
                                    {new Date(r.submittedAt).toLocaleString("cs-CZ")}
                                </td>
                                <td style={{...tdStyle, textAlign: "center"}}>
                                    <button
                                        onClick={() => handleApprove(r.id)}
                                        style={{
                                            ...btnStyle,
                                            background: "#28a745",
                                        }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(r.id)}
                                        style={{
                                            ...btnStyle,
                                            background: "#dc3545",
                                            marginLeft: "10px",
                                        }}
                                    >
                                         Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
};

const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    color: "#333",
    fontSize: "14px",
    verticalAlign: "top",
};

const btnStyle = {
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
};