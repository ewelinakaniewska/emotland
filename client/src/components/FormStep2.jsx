import { useFormContext } from "react-hook-form";
import Input from "./Input";

export default function FormStep2() {
  const { register, getValues, formState: { errors } } = useFormContext();

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const minDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  return (
    <>
      {errors.child?._global && (
        <p className="text-red-600 mb-4 text-center ">{errors.child._global.message}</p>
      )}

      <label htmlFor="child.childFirstName">Imię</label>
      <Input
        type="text"
        id="child.childFirstName"
        {...register("child.childFirstName", { required: "Imię jest wymagane" })}
        error={errors.child?.childFirstName?.message}
      />

      <label htmlFor="child.childName" className="mt-3">
        Nazwa użytkownika
      </label>
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

      <label htmlFor="child.childAge" className="mt-3">
        Wiek
      </label>
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

      <label htmlFor="child.childPassword" className="mt-3">
        Hasło
      </label>
      <Input
        type="password"
        id="child.childPassword"
        {...register("child.childPassword", {
          required: "Hasło jest wymagane",
          minLength: { value: 8, message: "Hasło musi mieć minimum 8 znaków" }
        })}
        error={errors.child?.childPassword?.message}
      />

      <label htmlFor="child.childPassword2" className="mt-3">
        Powtórz hasło
      </label>
      <Input
        type="password"
        id="child.childPassword2"
        {...register("child.childPassword2", {
          required: "Powtórzenie hasła jest wymagane",
          validate: value =>
            value === getValues("child.childPassword") || "Hasła muszą być takie same"
        })}
        error={errors.child?.childPassword2?.message}
      />
    </>
  );
}
