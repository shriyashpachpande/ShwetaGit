import { useEffect, useMemo, useState } from "react";
import { AnalyticsAPI } from "../../api/analyticsApi.js";
import KpiCards from "../../components/KpiCards.jsx";
import ReportsTrendChart from "../../components/ReportsTrendChart.jsx";
import TopDiagnosesBar from "../../components/TopDiagnosesBar.jsx";
import CoverageDonut from "../../components/CoverageDonut.jsx";

function iso(d) { return new Date(d).toISOString(); }
function daysAgo(n) { const x = new Date(); x.setDate(x.getDate() - n); return x; }

export default function AnalyticsPage() {
    const [from, setFrom] = useState(iso(daysAgo(30)));
    const [to, setTo] = useState(iso(new Date()));

    const params = useMemo(() => ({ from, to }), [from, to]);

    const [kpis, setKpis] = useState(null);
    const [top, setTop] = useState([]);
    const [trend, setTrend] = useState({ labels: [], series: [] });
    const [split, setSplit] = useState({ covered: 0, notCovered: 0, coverageSuccessPercent: 0 });

    async function load() {
        const [k, t, r, s] = await Promise.all([
            AnalyticsAPI.kpis(params),
            AnalyticsAPI.top({ ...params, limit: 5 }),
            AnalyticsAPI.trend({ ...params, bucket: "day" }),
            AnalyticsAPI.split(params)
        ]);
        setKpis(k.kpis);
        setTop(t.data);
        setTrend(r);
        setSplit(s);
    }

    useEffect(() => { load(); }, [from, to]);

    return (
        <div style={{ padding: 24 }}>
            <h2>Analytics Dashboard</h2>
            <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
                <div><label>From</label><input type="datetime-local" value={from.slice(0, 16)} onChange={(e) => setFrom(new Date(e.target.value).toISOString())} /></div>
                <div><label>To</label><input type="datetime-local" value={to.slice(0, 16)} onChange={(e) => setTo(new Date(e.target.value).toISOString())} /></div>
                <button onClick={load}>Refresh</button>
            </div>

            {kpis && <KpiCards kpis={kpis} />}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", padding: 12 }}>
                    <ReportsTrendChart labels={trend.labels} series={trend.series} />
                </div>
                <div style={{ background: "#fff", padding: 12 }}>
                    <CoverageDonut covered={split.covered} notCovered={split.notCovered} />
                </div>
            </div>

            <div style={{ background: "#fff", padding: 12, marginTop: 16 }}>
                <TopDiagnosesBar data={top} />
            </div>
        </div>
    );
}