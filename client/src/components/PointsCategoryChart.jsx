import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CategoryTooltip from "./CategoryTooltip";

export default function PointsCategoryChart({ data }) {

  const categoriesMap = {
    anger: "złość",
    fear: "strach",
    happiness: "szczę",
    sadness: "smutek",
    surprise: "zask",
    disgust: "zniems"
  };
  const categoriesFullMap = {
    anger: "złość",
    fear: "strach",
    happiness: "szczęście",
    sadness: "smutek",
    surprise: "zaskoczenie",
    disgust: "zniesmaczenie"
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} >
        <XAxis dataKey="label"
        tickFormatter={(val) => categoriesMap[val] || val}
        />
        <YAxis />
        <YAxis domain={[0, 'dataMax']} />
        <YAxis width={35} />
        <Tooltip 
          content={<CategoryTooltip fullMap={categoriesFullMap}
           valueLabel="średnia punktów" />}

        />
        <Bar dataKey="count" fill="#5a67d8" minBarSize={10}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
