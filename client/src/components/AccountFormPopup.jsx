import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ButtonAmberButton from "./ButtonAmberButton";
import FormStep1 from "../components/FormStep1";
import api from "../api/api";
import { useFormContext } from "react-hook-form";
import Input from "./Input";


 
export default function AccountFormPopup({ user, onClose, onSave }) {

 


  const methods = useForm({
    defaultValues: {
      parent: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: ""
      }
    }
  });

  const { 
    register, 
    setValue, 
    getValues, 
    handleSubmit, 
    formState: { errors } 
  } = methods;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await api.get(`/users/${user}`);
        const data = res.data;
        setValue("parent.firstName", data.firstName || "");
        setValue("parent.lastName", data.lastName || "");
        setValue("parent.email", data.email || "");
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      }
    }
    if (user) fetchUserData();
  }, [user, setValue]);

  function submit(values) {
    onSave(values.parent);
    console.log(values)
    alert("Zmieniono  dane")
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 p-5">

        <>
              {errors.parent?._global && (
                <p className="text-red-600 text-center mb-4">{errors.parent._global.message}</p>
              )}
        
              <label htmlFor="parent.firstName" className="text-lg">Imię</label>
              <Input
                type="text"
                id="parent.firstName"
                {...register("parent.firstName", { required: "Imię jest wymagane" })}
                error={errors?.parent?.firstName?.message}
              />
        
              <label htmlFor="parent.lastName" className="mt-3">
                Nazwisko
              </label>
              <Input
                type="text"
                id="parent.lastName"
                {...register("parent.lastName", { required: "Nazwisko jest wymagane" })}
                error={errors?.parent?.lastName?.message}
              />
        
              <label htmlFor="parent.email" className="mt-3">
                Adres e-mail
              </label>
              <Input
                type="email"
                id="parent.email"
                {...register("parent.email", {
                  required: "Email jest wymagany",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Nieprawidłowy adres e-mail"
                  }
                })}
                error={errors?.parent?.email?.message}
              />
        
              <label htmlFor="parent.password" className="mt-3">
                Hasło
              </label>
              <Input
                type="password"
                id="parent.password"
                {...register("parent.password", {
                  minLength: { value: 8, message: "Hasło musi mieć minimum 8 znaków" }
                })}
                error={errors?.parent?.password?.message}
              />
        
              <label htmlFor="parent.password2" className="mt-3">
                Powtórz hasło
              </label>
              <Input
                type="password"
                id="parent.password2"
                {...register("parent.password2", {
                  validate: value =>
                    value === getValues("parent.password") || "Hasła muszą być takie same"
                })}
                error={errors?.parent?.password2?.message}
              />
            </>

        <ButtonAmberButton text="Zapisz" type="submit" className="self-end"/>

      </form>
    </FormProvider>
  );
}
