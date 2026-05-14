export default function FilterButton({ label, value, selectedValue, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        text-lg  text-center font-semibold rounded-full py-2 px-5 
        px-7 lg:py-3 w-full cursor-pointer block  hover:bg-blue-900 
        hover:text-white  border border-2
        ${selectedValue === value ? "bg-blue-900 text-white shadow-sm" : "bg-white text-blue-900 "}
        `}
    >
      {label}
    </button>
  );
}
