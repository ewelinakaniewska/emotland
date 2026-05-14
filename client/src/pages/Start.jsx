import LinkButtonAmber from "../components/LinkButtonAmber";
import LinkButtonBlue from "../components/LinkButtonBlue";
import { useNavigate } from "react-router-dom";

export default function Start() {
  return (
    <div className="h-full flex flex-col justify-between lg:flex-row w-full  ">
      <div className="w-full h-48 sm:h-120 relative -z-1  lg:order-3 lg:w-fit lg:h-full lg:overflow-clip lg:static lg:min-h-170">
        <h1 className="text-4xl tracking-widest  text-blue-950  absolute top-1/2 left-1/2 sm:top-5 lg:top-10  lg:left-56 lg:mt-2 -translate-1/2 w-full text-center sm:mt-20 sm:text-4xl font-medium z-1">
          Kraina emocji
        </h1>
        <img
          src="/assets/blob-mini.png"
          alt="niebieski kształt"
          className="w-full max-h-80 sm:hidden"
        />
        <img
          src="/assets/blob-normal.png"
          alt="niebieski kształt"
          className="w-full max-h-200 hidden sm:inline lg:hidden"
        />
        <img
          src="/assets/blob-large.png"
          alt="niebieski kształt"
          className="hidden lg:inline "
        />
      </div>
      <div className="p-5 lg:pl-20 text-center lg:text-left h-full lg:flex lg:flex-col lg:justify-end lg:min-h-170">
        <main className="flex flex-col justify-evenly h-full  lg:h-3/4 lg:">
          <p className=" text-3xl font-semibold   text-blue-900 tracking-wide sm:max-w-120 mx-auto lg:max-w-200 lg:text-5xl">
            Witaj w miejscu, w którym nauka o emocjach staje się prosta i
            przyjemna
          </p>
          <section>
            <p className=" text-2xl text-blue-950 my-6">Załóż konto dla</p>
            <section className="flex flex-col  gap-5 sm:flex-row justify-center lg:justify-start">
              <LinkButtonBlue text="Rodzica i dziecka" route='/register-parent' />
              <LinkButtonBlue text="Terapeuty" route='/register-therapist' />
            </section>
          </section>
          <section className="flex flex-col justify-center items-center lg:items-start">
            <p className=" text-2xl font-bold text-blue-950 my-8 ">
              Masz już konto?
            </p>
            <LinkButtonAmber text="Zaloguj się" route='/login' />
          </section>
        </main>
      </div>
    </div>
  );
}
