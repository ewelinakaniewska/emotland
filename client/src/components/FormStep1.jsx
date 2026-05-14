import { useFormContext } from "react-hook-form";
import Input from "./Input";

export default function FormStep1() {

  const { register, getValues, formState: { errors } } = useFormContext();

  return (
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
          required: "Hasło jest wymagane",
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
          required: "Powtórzenie hasła jest wymagane",
          validate: value =>
            value === getValues("parent.password") || "Hasła muszą być takie same"
        })}
        error={errors?.parent?.password2?.message}
      />
    </>
  );
}
