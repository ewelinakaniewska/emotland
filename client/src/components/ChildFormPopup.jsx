import { useEffect } from "react";
import ButtonAmberButton from "./ButtonAmberButton";
import { useForm, FormProvider } from "react-hook-form";
import api from "../api/api";
import Input from "./Input";

export default function ChildFormPopup({ child = {}, onClose, onSave }) {
  const methods = useForm({
    defaultValues: {
      child: {
        childFirstName: "",
        childName: "",
        childAge: "",
        childPassword: "",
        childPassword2: "",
      }
    }
  });

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const minDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = methods;

  useEffect(() => {
    async function fetchUserData() {
      if (!child._id) return;

      try {
        const res = await api.get(`/users/${child._id}`);
        const data = res.data;

        setValue("child.childFirstName", data.firstName || "");
        setValue("child.childName", data.name || "");

        if (data.age) {
          const formattedDate = new Date(data.age).toISOString().slice(0, 10);
          setValue("child.childAge", formattedDate);
        }
      } catch (err) {
        console.error("Błąd pobierania danych dziecka:", err);
      }
    }

    fetchUserData();
  }, [child._id, setValue]);

  function submit(values) {
    const dataToSave = { ...values.child };
    if (child._id && !dataToSave.childPassword) {
      delete dataToSave.childPassword;
      delete dataToSave.childPassword2;
    }

    onSave({
      childId: child._id,
      ...dataToSave
    });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5 p-5 w-full">
        <h3 className="text-xl font-semibold text-center text-blue-950">
          {child._id ? "Edytuj dziecko" : "Dodaj dziecko"}
        </h3>

        <label htmlFor="child.childFirstName">Imię</label>
        <Input
          type="text"
          id="child.childFirstName"
          {...register("child.childFirstName", { required: "Imię jest wymagane" })}
          error={errors.child?.childFirstName?.message}
        />

        <label htmlFor="child.childName" className="mt-3">Nazwa użytkownika</label>
        <Input
          type="text"
          id="child.childName"
          {...register("child.childName", {
            required: "Nazwa użytkownika jest wymagana",
            pattern: {
              value: /^[a-zA-Z0-9._-]{3,20}$/,
              message: "Nazwa może zawierać litery, cyfry i znaki . _ - (3-20 znaków)"
            }
          })}
          error={errors.child?.childName?.message}
        />

        <label htmlFor="child.childAge" className="mt-3">Wiek</label>
        <Input
          type="date"
          id="child.childAge"
          min={minDate}
          max={maxDate}
          {...register("child.childAge", {
            required: "Data urodzenia jest wymagana",
            validate: {
              tooYoung: value => new Date(value) <= new Date(maxDate) || "Dziecko musi mieć co najmniej 8 lat",
              tooOld: value => new Date(value) >= new Date(minDate) || "Dziecko może mieć maksymalnie 16 lat"
            }
          })}
          error={errors.child?.childAge?.message}
        />

        <label htmlFor="child.childPassword" suppressHydrationWarning className="mt-3">
          Hasło
        </label>
        <Input
          type="password"
          id="child.childPassword"
          {...register("child.childPassword", {
            required: child._id ? false : "Hasło jest wymagane",
            minLength: { value: 8, message: "Hasło musi mieć minimum 8 znaków" }
          })}
          error={errors.child?.childPassword?.message}
        />

        <label htmlFor="child.childPassword2" className="mt-3">Powtórz hasło</label>
        <Input
          type="password"
          id="child.childPassword2"
          {...register("child.childPassword2", {
            required: child._id ? false : "Powtórzenie hasła jest wymagane",
            validate: value =>
              !value || value === getValues("child.childPassword") || "Hasła muszą być takie same"
          })}
          error={errors.child?.childPassword2?.message}
        />

        <ButtonAmberButton text={child._id ? "Zapisz" : "Dodaj"} type="submit" className="self-end" />
      </form>
    </FormProvider>
  );
}