import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CategoryAccuracyChart({ data }) {

  const categoriesFullMap = {
    anger: "Złość",
    fear: "Strach",
    happiness: "Szczęście",
    sadness: "Smutek",
    surprise: "Zaskoczenie",
    disgust: "Zniesmaczenie"
  };

  const categoriesMap = {
    anger: "złość",
    fear: "strach",
    happiness: "szczę",
    sadness: "smutek",
    surprise: "zask",
    disgust: "zniesm"
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = payload[0].payload.total;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <div><strong>{categoriesFullMap[payload[0].payload.label]}</strong></div>
          <div>Poprawne: {payload[0].value} ({total ? ((payload[0].value / total) * 100).toFixed(1) : 0}%)</div>
          <div>Błędne: {payload[1].value} ({total ? ((payload[1].value / total) * 100).toFixed(1) : 0}%)</div>
          <div>Razem: {total}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="label" tickFormatter={val => categoriesMap[val] || val} />
        <YAxis />
        <YAxis width={35} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="correct" stackId="a" fill="#4ade80" />
        <Bar dataKey="incorrect" stackId="a" fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  );
}
