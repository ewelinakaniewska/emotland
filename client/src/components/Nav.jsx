import NavElement from "./NavElement"
import ButtonBlueButton from "./ButtonBlueButton";
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../auth/useAuth";

export default function Nav({ onHeightChange }) {
  const navRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (!navRef.current) return;
      document.documentElement.style.setProperty(
        "--nav-height",
        `${navRef.current.offsetHeight}px`
      );
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);


  
  const { logout, role, user, name } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header ref={navRef} className="flex justify-between items-center bg-white shadow-md lg:w-full sticky top-0 lg:z-40 z-40 ">
      <h1 className="p-5 text-2xl tracking-widest text-blue-900 font-bold">Kraina emocji</h1>
      
      <img src="/assets/menu.png" alt="ikona menu" className={`size-12 cursor-pointer lg:hidden mr-5 ${isOpen ? "hidden" : "visible"}`} onClick={() => setIsOpen(true)} />

      <nav id="nav" className={`text-right flex-col z-2 justify-between h-screen w-2/3 bg-neutral-100 fixed left-0 top-0 sm:w-1/2 ${isOpen ? "flex" : "hidden"} lg:flex lg:flex-row lg:h-auto lg:static lg:flex-wrap lg:justify-start lg:w-auto lg:bg-white `}>
        
        <img src="/assets/X.png" alt="ikona x" className="size-12 ml-auto mr-5 mt-5 mb-10 cursor-pointer lg:hidden" onClick={() => setIsOpen(false)} />

        <ul className="lg:flex lg:items-center">
          {role === "parent" && (
            <>
              <NavElement text="Statystyki" route="/dashboard-parent-stats" />
              <NavElement text="Historia" route="/dashboard-parent-history" />
              <NavElement text="Czat" route="/dashboard-parent-chat" />
              <NavElement text="Artykuły" route="/dashboard-parent-articles" />
              <NavElement text="Konto" route="/dashboard-parent-settings" />
            </>
          )}
          {role === "therapist" && (
            <>
              <NavElement text="Statystyki" route="/dashboard-therapist-stats" />
              <NavElement text="Historia" route="/dashboard-therapist-history" />
              <NavElement text="Czat" route="/dashboard-therapist-chat" />
              <NavElement text="Artykuły" route="/dashboard-therapist-articles" />
              <NavElement text="Konto" route="/dashboard-therapist-settings" />
              <NavElement text="Zadania" route="/dashboard-therapist-tasks" />
              <NavElement text="Rozdziały" route="/dashboard-therapist-chapters" />
            </>
          )}
        </ul>

        <div className="p-5 mt-auto flex flex-col lg:flex-row lg:items-center gap-4 lg:mt-0">
          <div className="text-right lg:text-left">
            <p className=" font-semibold text-blue-900 leading-tight">
              {name || "Użytkownik"}
            </p>
            <p className="text-sm text-gray-500 ">
              {role === "therapist" ? "Terapeuta" : "Rodzic"}
            </p>
          </div>
          
        </div>
        <div className="p-5 my-auto">

        <ButtonBlueButton text="Wyloguj" func={logout} />
        </div>
      </nav>
    </header>
  );
}