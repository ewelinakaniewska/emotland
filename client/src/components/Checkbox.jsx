export default function Checkbox({ error, className = "", ...rest }) {
  return (
    <label
      htmlFor={rest.id}
      className="flex items-center cursor-pointer select-none"
    >

      <input

        className="hidden"
        {...rest}
        type="checkbox"
      />

      <span
        className={`
          w-8 h-8 flex items-center justify-center rounded-md border transition-colors duration-200
          ${rest.checked ? "bg-blue-900 border-blue-900" : error ? "bg-white border-red-600" : "bg-white border-gray-400"}
          
          ${className}
        `}
      >
        {rest.checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

    </label>
  );
}
