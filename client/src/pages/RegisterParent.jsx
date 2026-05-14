import FormStep1 from "../components/FormStep1";
import FormStep2 from "../components/FormStep2";
import FormStep3 from "../components/FormStep3";
import ButtonAmberButton from "../components/ButtonAmberButton";
import FormStep from "../components/FormStep"
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import axios from 'axios'

export default function RegisterParent() {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const methods = useForm({
    defaultValues: {
      parent: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: ""

      },
      child: {
        childFirstName: "",
        childName: "",
        childAge: "",
        childPassword: "",
        childPassword2: ""
      },
      agreements: {
        acceptTerms: false,
        privacy: false,
        rodo: false,
        notifications: false
      }
    }
  });

  const { handleSubmit, setError, trigger } = methods;
  async function nextStep() {
    let stepFields = [];
    if (step === 1) {
      stepFields = [
        "parent.firstName",
        "parent.lastName",
        "parent.email",
        "parent.password",
        "parent.password2"
      ];
    }
    if (step === 2) {
      stepFields = [
        "child.childFirstName",
        "child.childName",
        "child.childAge",
        "child.childPassword",
        "child.childPassword2"
      ];
    }
    const valid = await trigger(stepFields);

    if (valid) {
      setStep(s => s + 1);
    }
  }

  function prevStep() {
    setStep(s => s - 1);
  }

  async function onSubmit(data) {
    try {
      const res = await axios.post("http://localhost:5000/auth/registerParent", data);
  alert("Konto utworzone! Sprawdź swoją pocztę, aby potwierdzić e-mail przed logowaniem.");
      navigate("/login");
    } catch (err) {

      const errors = err.response?.data?.errors;

      if (errors) {

        Object.entries(errors).forEach(([path, message]) => {
          setError(path, { type: "server", message });

          if (path.startsWith("parent.")) setStep(1);
          if (path.startsWith("child.")) setStep(2);
          if (path.startsWith("agreements.")) setStep(3);

        });
      }
    }
  }

  return (
    <div
      className="w-full min-h-dvh p-4 bg-linear-to-t from-amber-200/30 to-blue-200/30 to-60% flex flex-col items-start justify-start lg:items-center lg:justify-center
    "
    >
      <div
        className="bg-white rounded-4xl w-full shadow-md overflow-hidden text-center tracking-wide flex flex-col  min-h-220
      sm:max-w-180 sm:mx-auto 
       lg:grid lg:grid-cols-2 lg:max-w-300 lg:flex-none lg:items-stretch lg:min-h-180"
      >
        <div
          className="bg-blue-200 w-full  rounded-bl-full p-6 flex justify-center
         sm:h-90 sm:relative  sm:overflow-hidden 
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
        <div className="p-4 flex flex-col justify-start gap-5  text-lg lg:mx-auto flex-1 ">
          <h3 className="text-3xl font-semibold text-blue-950 mt-7">
            Załóż konto
          </h3>

          <section className="flex justify-evenly gap-5 my-3 sm:w-2/3 sm:mx-auto lg:w-3/4">
            <FormStep label="Dane rodzica" number="1" active={step == 1 ? true : false} />
            <FormStep label="Dane dziecka" number="2" active={step == 2 ? true : false} />
            <FormStep label="Regulamin i prywatność" number="3" active={step >= 3 ? true : false} />

          </section>
          <section className="h-full flex-1 flex flex-col">
            <FormProvider {...methods}>

              <form onSubmit={(e) => e.preventDefault()}
                className=" flex flex-col w-full justify-between h-full flex-1 text-blue-950 text-left sm:w-3/4 sm:mx-auto ">
                {step === 1 && <FormStep1 nextStep={nextStep} />}
                {step === 2 && <FormStep2 nextStep={nextStep} prevStep={prevStep} />}
                {step === 3 && <FormStep3 prevStep={prevStep} />}

                <div className="mb-2 sm:mb-5 lg:my-5 mt-5 flex flex-col lg:flex-row justify-between w-full gap-2 ">
                  {step > 1 && (
                    <ButtonAmberButton
                      type="button"
                      text="Wstecz"
                      func={prevStep}
                    />
                  )}

                  {step < 3 ? (
                    <ButtonAmberButton
                      className="ml-auto"
                      type="button"
                      text="Dalej"
                      func={nextStep}
                    />
                  ) : (
                    <ButtonAmberButton
                      type="button"
                      text="Załóż konto"
                      func={handleSubmit(onSubmit)}
                    />
                  )}

                </div>

              </form>
            </FormProvider>

          </section>
          <p className="font-light text-center px-10 py-3 mt-auto lg:mt-0">Masz już konto? <span onClick={() =>navigate('/login')} className="font-bold text-blue-900 underline cursor-pointer hover:text-blue-950">zaloguj</span></p>
        </div>
      </div>
    </div>
  );
}
