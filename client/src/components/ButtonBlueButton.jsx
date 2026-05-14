export default function ButtonBlueButton({ text, className, func, type = "button" }) {
  return (
    <button
      type={type}
      className={`
         lg:w-fit text-lg text-white text-center 
         font-semibold rounded-full py-4 px-7 lg:py-3 
         w-full cursor-pointer block bg-blue-900 
         hover:bg-blue-950
        ${className}
        `}
      onClick={func}
    >
      {text}
    </button>
  );
}
