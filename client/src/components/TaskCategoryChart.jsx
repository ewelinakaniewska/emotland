import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#68d391", "#3182ce", "#d53f8c", "#63b3ed", "#f6ad55", "#f56565"];

const categoriesFullMap = {
  anger: "złość",
  fear: "strach",
  happiness: "szczęście",
  sadness: "smutek",
  surprise: "zaskoczenie",
  disgust: "zniesmaczenie"
};

export default function TaskCategoryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ label }) => categoriesFullMap[label] || label}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [value, categoriesFullMap[props.payload.label] || props.payload.label]}
        />
        <Legend formatter={(value) => categoriesFullMap[value] || value}

        />
      </PieChart>
    </ResponsiveContainer>
  );
}
