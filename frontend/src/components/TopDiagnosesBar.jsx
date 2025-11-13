import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function TopDiagnosesBar({ data }) {
    const rows = data.map((d) => ({ label: d.label, value: d.value }));
    return (
        <div>
            <h4>Top Diagnoses</h4>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}