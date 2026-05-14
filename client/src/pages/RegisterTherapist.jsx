import Input from "../components/Input";
import ButtonAmberButton from "../components/ButtonAmberButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios'

export default function RegisterTherapist() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      firstNameTherapist: "",
      lastNameTherapist: "",
      emailTherapist: "",
      passwordTherapist: "",
      password2Therapist: ""
    }

  });

  const onSubmit = async (data) => {
    setGlobalError(null);

    try {
      const response = await axios.post('http://localhost:5000/auth/registerTherapist', data);
alert("Konto utworzone! Sprawdź swoją pocztę, aby potwierdzić e-mail przed logowaniem.");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        const data = err.response.data;

        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setError(field, { type: "server", message });
          });
        }

        if (data.message) {
          setGlobalError(data.message);
        }

        if (!data.errors && !data.message) {
          setGlobalError("Wystąpił nieznany błąd serwera");
        }
      } else if (err.request) {
        setGlobalError("Brak połączenia z serwerem");
      } else {
        setGlobalError("Nieoczekiwany błąd");
      }
    }
  };

  return (
    <div
      className="w-full min-h-dvh p-4 bg-linear-to-t from-amber-200/30 to-blue-200/30 to-60% flex flex-col items-start justify-start lg:items-center lg:justify-center
    "
    >
      <div
        className="bg-white rounded-4xl w-full shadow-md overflow-hidden text-center tracking-wide flex flex-col 
      sm:max-w-180 sm:mx-auto 
       lg:grid lg:grid-cols-2 lg:max-w-300 lg:flex-none lg:items-stretch"
      >
        <div
          className="bg-blue-200 w-full overflow-hidden  rounded-bl-full p-6 flex justify-center
         sm:h-90 sm:relative  
        lg:h-full lg:rounded-bl-none lg:rounded-br-full  lg:p-10 lg:text-left lg:tracking-widest"
        >
          <img
            src="/assets/happy_boy.png"
            alt="szczęśliwy chłopiec"
            className="invisible hidden sm:block sm:visible sm:absolute sm:-bottom-2 sm:left-50 sm:h-70 
         lg:-scale-x-100 lg:bottom-40 lg:left-auto lg:right-1/12 lg:h-100"
          />
          <img
            src="/assets/sad_girl.png"
            alt="szczęśliwy chłopiec"
            className="invisible hidden sm:block sm:visible sm:absolute sm:-bottom-4 sm:right-2 sm:h-60 
         lg:-scale-x-100 lg:bottom-0 lg:-left-4 lg:h-90"
          />

          <h1 className="text-4xl  font-bold text-blue-950  my-auto leading-13 sm:text-5xl sm:mt-2 z-2 ">
            Witaj w krainie emocji!
          </h1>
        </div>
        <div className="p-4 flex flex-col justify-start gap-5  text-lg lg:mx-auto flex-1 w-full">
          <h3 className="text-3xl font-semibold text-blue-950 mt-7">
            Załóż konto
          </h3>

          <section className="">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" flex flex-col w-full text-blue-950 text-left sm:w-3/4 sm:mx-auto "
            >

              <div className="text-center min-h-13 text-red-600 p-3 mb-2">
                {globalError}
              </div>

              <>
                <label htmlFor="firstNameTherapist">Imię</label>
                <Input type="text" id="firstNameTherapist" 
                  {...register("firstNameTherapist", { required: "Imię jest wymagane" })}
                  error={errors.firstNameTherapist?.message}
                />

                <label htmlFor="lastNameTherapist" className="mt-3">
                  Nazwisko
                </label>
                <Input type="text" id="lastNameTherapist" 
                  {...register("lastNameTherapist", { required: "Nazwisko jest wymagane" })}
                  error={errors.lastNameTherapist?.message}
                />

                <label htmlFor="emailTherapist" className="mt-3">
                  Adres e-mail
                </label>

                <Input type="email" id="emailTherapist" 
                  {...register("emailTherapist", {
                    required: "Email jest wymagany",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Nieprawidłowy adres e-mail"
                    }
                  })}
                  error={errors.emailTherapist?.message}
                />

                <label htmlFor="passwordTherapist" className="mt-3">
                  Hasło
                </label>
                <Input type="password" id="passwordTherapist"
                  {...register("passwordTherapist", {
                    required: "Hasło jest wymagane",
                    minLength: { value: 8, message: "Hasło musi mieć minimum 8 znaków" }
                  })}
                  error={errors.passwordTherapist?.message}
                />

                <label htmlFor="password2Therapist" className="mt-3">
                  Powtórz hasło
                </label>
                <Input type="password" id="password2Therapist"
                  {...register("password2Therapist", {
                    required: "Powtórzenie hasła jest wymagane",
                    validate: value =>
                      value === getValues("passwordTherapist") || "Hasła muszą być takie same"
                  })}
                  error={errors.password2Therapist?.message}
                />

                <div className="mt-12 mb-2 sm:mb-5 lg:my-5 ml-auto flex justify-end w-full gap-2">
                  <ButtonAmberButton text="Załóż konto" type="submit"/>
                </div>
                <p className="font-light text-center px-10 py-3 mt-auto lg:mt-0">Masz już konto? <span onClick={() =>navigate('/login')} className="font-bold text-blue-900 underline cursor-pointer hover:text-blue-950">zaloguj</span></p>
              </>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
