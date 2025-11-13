import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ReportsTrendChart({ labels = [], series = [] }) {
    const s0 = Array.isArray(series) && series.length > 0 && Array.isArray(series.data) ? series.data : [];
    const data = (Array.isArray(labels) ? labels : []).map((d, i) => ({
        date: new Date(d).toLocaleDateString(),
        count: s0[i] ?? 0
    }));
    return (
        <div>
            <h4>Reports Trend</h4>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}