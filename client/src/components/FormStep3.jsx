import { useFormContext } from "react-hook-form";
import Checkbox from "./Checkbox";

export default function FormStep3() {
  const { register, formState: { errors }, watch } = useFormContext();

  const values = watch("agreements") || {};

  return (
    <section className="flex flex-col gap-6">

      <div>
        <div className="flex flex-row justify-start pl-5 gap-4 items-start">
          <Checkbox
            id="agreements.acceptTerms"
            checked={values.acceptTerms || false}
            {...register("agreements.acceptTerms", { required: "Pole wymagane" })}
            error={errors.agreements?.acceptTerms}
          />
          <label htmlFor="agreements.acceptTerms" className="inline">
            Akceptuję{" "}
            <a href="#"><b>regulamin serwisu</b></a>
          </label>
        </div>

        {errors.agreements?.acceptTerms && (
          <p className="text-red-600 text-sm pl-5 mt-1 ">
            {errors.agreements.acceptTerms.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-row justify-start pl-5 gap-4 items-start">
          <Checkbox
            id="agreements.privacy"
            checked={values.privacy || false}
            {...register("agreements.privacy", { required: "Pole wymagane" })}
            error={errors.agreements?.privacy}
          />
          <label htmlFor="agreements.privacy" className="inline">
            Zapoznałem/am się z{" "}
            <a href="#"><b>polityką prywatności</b></a>
          </label>
        </div>

        {errors.agreements?.privacy && (
          <p className="text-red-600 text-sm pl-5 mt-1">
            {errors.agreements.privacy.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-row justify-start pl-5 gap-4 items-start">
          <Checkbox
            id="agreements.rodo"
            checked={values.rodo || false}
            {...register("agreements.rodo", { required: "Pole wymagane" })}
            error={errors.agreements?.rodo}
          />
          <label htmlFor="agreements.rodo" className="inline">
            Wyrażam zgodę na przetwarzanie danych mojego dziecka (RODO)
          </label>
        </div>

        {errors.agreements?.rodo && (
          <p className="text-red-600 text-sm pl-5 mt-1">
            {errors.agreements.rodo.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-row justify-start pl-5 gap-4 items-start">
          <Checkbox
            id="agreements.notifications"
            checked={values.notifications || false}
            {...register("agreements.notifications")}
          />
          <label htmlFor="agreements.notifications" className="inline">
            (opcjonalne) Chcę otrzymywać powiadomienia e-mail
          </label>
        </div>
      </div>

    </section>
  );
}
