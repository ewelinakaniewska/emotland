export default function CustomCategoryTooltip({
  active,
  payload,
  label,
  fullMap = {},
  valueLabel = "wartość"
}) {
  if (!active || !payload || !payload.length) return null;

  const translatedLabel = fullMap[label] || label;

  return (
    <div className="bg-white border border-gray-300 p-2 rounded shadow">
      <p className="font-bold">{translatedLabel}</p>

      {payload.map((item, idx) => (
        <p key={idx} style={{ color: item.fill }}>
          {valueLabel}: {Number(item.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
}
