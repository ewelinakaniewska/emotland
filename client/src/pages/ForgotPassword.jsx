import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Input from "../components/Input";
import ButtonAmberButton from "../components/ButtonAmberButton";
import LinkButtonAmber from "../components/LinkButtonAmber"

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(data) {
    try {
      await axios.post("http://localhost:5000/auth/forgotPassword", { email: data.email });
      setMessage("Link do resetowania hasła został wysłany na Twój e-mail.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Nie udało się wysłać maila.");
      setMessage("");
    }
  }

  return (

    <div
      className="bg-linear-to-t from-amber-200/30 to-blue-200/30 to-60% p-4 min-h-dvh flex flex-col lg:justify-center lg:items-center
            "
    >
      <div
        className="bg-white rounded-4xl w-110 max-h-120  mx-auto  my-auto shadow-md overflow-hidden text-center tracking-wide  flex-1 flex flex-col justify-between align-center lg:flex-row lg:flex-none lg:w-150 lg:max-w-auto "
      >

        <div className="p-5 flex flex-col  gap-2  text-lg lg:mx-auto flex-1 w-full lg:flex-2 w-full">
          <h3 className="text-3xl font-semibold text-blue-950 mb-6">Resetuj hasło</h3>
          <p className="text-neutral-700 mb-4 px-4">Wpisz swój e-mail, a wyślemy Ci link do zmiany hasła.</p>

          {message && <p className="text-green-700 mb-4 font-medium">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="text-center w-full mx-auto">
            <label htmlFor="email" className="block">Twój e-mail</label>
            <div className="flex-col flex w-7/10 mx-auto">

            <Input
              type="email"
              {...register("email", { required: "Email jest wymagany" })}
              error={errors.email?.message}
            />
            </div>
            <div className="mt-8 flex justify-center gap-2">
              <ButtonAmberButton text="Wyślij link" type="submit" />
               <LinkButtonAmber text="Logowanie" route="/login"/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}