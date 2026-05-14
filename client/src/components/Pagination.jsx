export default function Pagination({ page, totalPages, onChange }) {

  const handleChange = (newPage) => {
    onChange(newPage);
    scrollToTop();
  };

  return (
    <div className="flex items-center justify-center gap-2 pb-16 mt-auto">

      <button
        onClick={() => handleChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 text-gray-700
                   hover:bg-amber-600 hover:text-white transition cursor-pointer
                   disabled:opacity-40 disabled:hover:bg-gray-200 disabled:hover:text-gray-700 disabled:cursor-default"
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          onClick={() => handleChange(num)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
            ${page === num
              ? "bg-blue-900 text-white border border-blue-900"
              : "bg-gray-100 text-gray-700 hover:bg-amber-600 hover:text-white cursor-pointer"
            }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => handleChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 text-gray-700
                   hover:bg-amber-600 hover:text-white transition cursor-pointer
                   disabled:opacity-40 disabled:hover:bg-gray-200"
      >
        &gt;
      </button>
    </div>
  );
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
