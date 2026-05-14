import Input from "../components/Input";
import ButtonAmberButton from "../components/ButtonAmberButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      login: "",
      password: ""
    }
  });

  const [serverError, setServerError] = useState("");

  function canUserAccess(role, path) {
    if (role === "therapist" && path.startsWith("/dashboard-therapist")) return true;
    if (role === "parent" && path.startsWith("/dashboard-parent")) return true;
    if (role === "child" && path.startsWith("/dashboard-child")) return true;
    return false;
  }

  async function onSubmit(data) {
    try {
      const role = await login(data.login, data.password);

      if (from && canUserAccess(role, from)) {
        navigate(from, { replace: true });
        return;
      }
      switch (role) {
        case "therapist":
          navigate("/dashboard-therapist-stats", { replace: true });
          break;
        case "parent":
          navigate("/dashboard-parent-stats", { replace: true });
          break;
        case "child":
          navigate("/dashboard-child-mainpanel", { replace: true });
          break;
        default:
          null
      }
    } catch (err) {
      setServerError(err.response?.data?.error || "Niepoprawne dane logowania");
      console.log(err)

    }

  }

  return (
    <div
      className="bg-linear-to-t from-amber-200/30 to-blue-200/30 to-60% p-4 min-h-dvh flex flex-col lg:justify-center lg:items-center
    "
    >
      <div
        className="bg-white rounded-4xl w-full shadow-md overflow-hidden text-center tracking-wide  flex-1 flex flex-col justify-between align-center lg:flex-row lg:flex-none lg:max-w-250 lg:min-h-170"
      >
        <div
          className="bg-blue-200 w-full overflow-hidden  rounded-bl-full p-6 
         relative  flex-1  sm:flex-2
        lg:rounded-bl-none lg:rounded-br-full  lg:p-10 lg:text-left lg:tracking-widest"
        >
          <img
            src="/assets/happy_boy.png"
            alt="szczęśliwy chłopiec"
            className="absolute -bottom-10 -right-10 h-55 sm:h-70  sm:left-50 sm:bottom-0
         lg:-scale-x-100 lg:bottom-40 lg:left-auto lg:right-1/12 lg:h-100 z-0"
          />
          <img
            src="/assets/sad_girl.png"
            alt="smutna dziewczynka"
            className="invisible hidden sm:block sm:visible sm:absolute sm:-bottom-4 sm:right-2 sm:h-60 
         lg:-scale-x-100 lg:bottom-0 lg:-left-4 lg:h-90"
          />

          <h1 className="text-4xl  font-bold text-blue-950  my-auto leading-13 sm:text-5xl relative sm:mt-2 z-10 ">
            Witaj w krainie emocji!
          </h1>
        </div>
        <div className="p-4 flex flex-col justify-between gap-5  text-lg lg:mx-auto flex-1 w-full lg:flex-2">
          <h3 className="text-3xl font-semibold text-blue-950 mt-7">
            Zaloguj się
          </h3>

          <section className="min-h-7">
            {serverError && <p className="text-red-600 text-center">{serverError}</p>}
          </section>
          <section className="">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" flex flex-col w-full text-blue-950 text-left sm:w-3/4 sm:mx-auto "
            >
              <>
                <label htmlFor="login">Login</label>
                <Input type="text" name="login"
                  {...register("login", { required: "Login jest wymagany" })}
                  error={errors.login?.message} />

                <label htmlFor="password" className="mt-3">
                  Hasło
                </label>
                <Input type="password" name="password"
                  {...register("password", { required: "Hasło jest wymagane" })}
                  error={errors.password?.message} />

                <div className="mt-12 mb-2 sm:mb-5 lg:my-5 ml-auto flex justify-end w-full gap-2">
                  <ButtonAmberButton text="Zaloguj" type="submit" />
                </div>

              </>
            </form>

          </section>
          <section>
            <p
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-neutral-500 cursor-pointer hover:underline mt-2 text-center"
            >
              Zapomniałeś hasła?
            </p>
            <p className="font-light text-center px-10 py-3 mt-auto lg:mt-0">Nie masz konta? Zarejestruj się jako <span onClick={() => navigate('/register-parent')} className="font-bold text-blue-900 underline cursor-pointer hover:text-blue-950">rodzic</span> lub <span onClick={() => navigate('/register-therapist')} className="font-bold text-blue-900 underline cursor-pointer hover:text-blue-950">terapeuta</span></p>
          </section>

        </div>
      </div>
    </div>
  );
}
