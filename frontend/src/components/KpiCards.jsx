export default function KpiCards({ kpis }) {
    const items = [
        { title: "Total (range)", value: kpis.totalReports },
        { title: "This Month", value: kpis.thisMonthReports },
        { title: "Last Month", value: kpis.lastMonthReports },
        { title: "Coverage %", value: `${kpis.coverageSuccessPercent} %` },
        { title: "Covered", value: kpis.coveredCount },
        { title: "Not Covered", value: kpis.notCoveredCount }
    ];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "12px 0" }}>
            {items.map((it) => (
                <div key={it.title} style={{ background: "#fff", padding: 12, border: "1px solid #eee" }}>
                    <div style={{ color: "#777", fontSize: 12 }}>{it.title}</div>
                    <div style={{ fontSize: 22, fontWeight: 600 }}>{it.value}</div>
                </div>
            ))}
        </div>
    );
}
