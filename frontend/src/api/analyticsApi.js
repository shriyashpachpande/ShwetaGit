const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function authHeader() {
    const ok = sessionStorage.getItem("adminLoggedIn") === "1";
    if (!ok) return {};
    // const token = btoa('admin:admin');
    return { Authorization: 'Basic ' + btoa('admin:admin') };
}

async function getJSON(path, params = {}) {
    const url = new URL(`${BASE}${path}`);
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
    
    const res = await fetch(url.toString(), { headers: { ...authHeader() } });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export const AnalyticsAPI = {
    kpis: (p) => getJSON("/admin/analytics/kpis", p),
    top: (p) => getJSON("/admin/analytics/top-diagnoses", p),
    trend: (p) => getJSON("/admin/analytics/reports-trend", p),
    split: (p) => getJSON("/admin/analytics/coverage-split", p),
};
