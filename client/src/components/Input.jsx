export default function Input({ error, className = "", ...rest }) {
  return (
    <>
      <input
        {...rest}
        className={`
        border rounded-full h-10 my-1 px-4 focus:border-blue-900 bg-white
        ${error ? "border-red-600" : "border-neutral-400"}
        ${className}
      `}
      />
      {error && <p className="text-red-600 inline-block text-sm text-right min-h-5">{error}</p>}
    </>
  );
}
