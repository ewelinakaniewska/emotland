export default function ButtonAmberButton({
  text,
  className = "",
  func,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={func}
      disabled={disabled}
      className={`
        lg:w-fit w-full
        text-lg text-white text-center font-semibold
        rounded-full py-3 px-7
        bg-amber-600 hover:bg-amber-700
        transition 
        ${disabled ? "opacity-50 cursor-not-allowed " : "cursor-pointer "} 
        ${className}
      `}
    >
      {text}
    </button>
  );
}
