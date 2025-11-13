import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const [err, setErr] = useState("");
    const nav = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        if (u === "admin" && p === "admin") {
            sessionStorage.setItem("adminLoggedIn", "1");
            nav("/admin", { replace: true });
        } else setErr("Invalid credentials");
    };

    return (
        <div className="mt-20" style={{ maxWidth: 360, margin: "80px auto" }}>
            <h2>Admin Login</h2>
            <form onSubmit={onSubmit}>
                <div><label>Username</label><input value={u} onChange={(e) => setU(e.target.value)} placeholder="admin" /></div>
                <div><label>Password</label><input value={p} onChange={(e) => setP(e.target.value)} type="password" placeholder="admin" /></div>
                {err && <div style={{ color: "red" }}>{err}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}