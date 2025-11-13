import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function CoverageDonut({ covered = 0, notCovered = 0 }) {
    const c = Number.isFinite(Number(covered)) ? Number(covered) : 0;
    const n = Number.isFinite(Number(notCovered)) ? Number(notCovered) : 0;

    const data = [
        { name: "Covered", value: c },
        { name: "Not Covered", value: n }
    ];

    const COLORS = ["#22c55e", "#ef4444"];

    const renderLabel = (entry) => `${entry.name} (${entry.value})`;

    return (
        <div>
            <h4>Coverage Split</h4>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={data}
                        innerRadius={70}
                        outerRadius={110}
                        label={renderLabel}
                        labelLine={false}
                        isAnimationActive={false}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v}`, n]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
