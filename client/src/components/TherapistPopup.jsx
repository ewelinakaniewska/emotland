import { useState } from "react";
import ButtonAmberButton from "./ButtonAmberButton";

export default function TherapistPopup({ onClose, onSave }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
      setError("");
     try {
      await onSave(code); 
    } catch (err) {

      setError(err?.response?.data?.message || "Wystąpił błąd podczas łączenia");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
      <h3 className="text-xl font-semibold text-center text-blue-950">Połącz z terapeutą</h3>
      <input
        name="code"
        value={code}
        onChange={e => setCode(e.target.value)}
        className="border border-gray-300 rounded-xl p-2"
        placeholder="Kod terapeuty"
        required
      />
       {error && (
        <p className="text-red-600 text-sm text-center">
          {error}
        </p>
      )}
      <ButtonAmberButton text="Połącz" type="submit"/>
    </form>
  );
}
