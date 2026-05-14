import { useAuth } from "../auth/useAuth";
import LinkButtonBlue from "../components/LinkButtonBlue"
import ButtonBlueButton from "../components/ButtonBlueButton";

export default function Forbidden() {
  const { role, logout } = useAuth();

  const roleHomeMap = {
    therapist: "/dashboard-therapist-stats",
    parent: "/dashboard-parent-stats",
    child: "/dashboard-child-mainpanel",
  };

  const homePath = roleHomeMap[role] || "/";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-blue-900">403</h1>

      <p className="mt-4 text-xl text-gray-700">
        Nie masz uprawnień do tej strony
      </p>


      <div className="mt-8 flex gap-4">

        <LinkButtonBlue route={homePath} text="Strona główna" />


        <ButtonBlueButton
          func={logout}
          text="Wyloguj się"
        />

      </div>
    </div>
  );
}
