import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LinkButtonAmber from "../components/LinkButtonAmber"
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios.get(`http://localhost:5000/auth/verify-email?token=${token}`)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    }
  }, [searchParams]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md">
        {status === "verifying" && <h2 className="text-2xl">Weryfikujemy Twój e-mail...</h2>}
        {status === "success" && (
          <>
            <h2 className="text-2xl text-green-700 font-bold">Sukces!</h2>
            <p className="my-4">Twój e-mail został potwierdzony. Możesz się teraz zalogować.</p>
            <div className="w-full flex justify-end">

            <LinkButtonAmber route="/login" text="Zaloguj się"  className="ml-auto"/>
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl text-red-600 font-bold">Błąd!</h2>
            <p className="my-4">Link jest nieprawidłowy lub wygasł.</p>
            <LinkButtonAmber route="/login" text="Wróć do logowania" className="ml-auto"/>
          </>
        )}
      </div>
    </div>
  );
}