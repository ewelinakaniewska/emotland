import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TotalTasksChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} width={35} />

        <Tooltip />
        <Bar dataKey="count" fill="#3182ce" />
      </BarChart>
    </ResponsiveContainer>
  );
}
