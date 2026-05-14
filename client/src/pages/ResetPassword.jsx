import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import ButtonAmberButton from "../components/ButtonAmberButton";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const token = searchParams.get("token");

  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  async function onSubmit(data) {
    try {
      await axios.post("http://localhost:5000/auth/resetPassword", {
        token,
        password: data.password
      });
      alert("Hasło zostało zmienione. Możesz się zalogować.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Link wygasł lub jest błędny.");
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

        <div className="p-4 flex flex-col  gap-5  text-lg lg:mx-auto flex-1 w-full lg:flex-2 w-full">
          <h3 className="text-3xl font-semibold text-blue-950 my-6">Ustaw nowe hasło</h3>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="text-left mx-auto ">

            <div className="flex-col flex">
              <label htmlFor="password" className="block">Nowe hasło</label>
              <Input
                type="password"
                {...register("password", {
                  required: "Hasło jest wymagane",
                  minLength: { value: 8, message: "Minimum 8 znaków" }
                })}
                error={errors.password?.message}
              />
            </div>

            <div className="flex-col flex">

              <label htmlFor="password2" className="mt-4 block">Powtórz hasło</label>
              <Input
                type="password"
                {...register("password2", {
                  validate: v => v === getValues("password") || "Hasła nie są identyczne"
                })}
                error={errors.password2?.message}
              />
            </div>

            <div className="flex justify-end mt-10">
              <ButtonAmberButton text="Zapisz hasło" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


