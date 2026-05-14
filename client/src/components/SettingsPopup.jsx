export default function SettingsPopup({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl cursor-pointer"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
