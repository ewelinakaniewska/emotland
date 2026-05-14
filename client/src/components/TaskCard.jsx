import { useAuth } from "../auth/useAuth";
import { NavLink } from "react-router-dom";

export default function TaskCard({ task, onDelete }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const options = task.options.map((opt, index) => {
        return <button key={index} className={`w-full bg-blue-200 py-5 rounded-xl px-1 `}>{opt}</button>
    })

    const { role } = useAuth()
    const { user } = useAuth()

    function checkAuthor() {
        if (role === "therapist" && task.author._id == user) {
            return true
        }
        else return false
    }

    const categoriesPL = {
        anger: "Gniew",
        fear: "Strach",
        happiness: "Szczęście",
        sadness: "Smutek",
        surprise: "Zaskoczenie",
        disgust: "Zniesmaczenie"
    };

    const ageCatPL = {
        junior: "8-11",
        middle: "12-13",
        senior: "14-16"
    }

    const questionTypePL = {
        single_choice: "jednokrotny wybór",
        ai: "naśladaowanie emocji"
    }
    return (
        <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 mb-10 z-2  flex flex-col gap-3 justify-center
            lg:w-9/10 lg:mx-auto">

            {
                checkAuthor() ?
                    <section className="flex gap-2 items-center justify-end" >
                        <button className="p-0 m-0" onClick={() => onDelete(task._id)}>
                            <img src="trashcan.svg" alt="ikona kosza na śmieci" className="size-9 cursor-pointer hover:scale-110 transition-all" />
                        </button>
                        <NavLink to={`/dashboard-therapist-tasks/edit/${task._id}`}>
                            <img src="edit.svg" alt="ikona kosza na śmieci" className="size-8 cursor-pointer hover:scale-110 transition-all" />
                        </NavLink>
                    </section> :
                    null
            }
            <p className="text-center mx-auto font-semibold text-2xl my-3"> {task.text}</p>

            <div className="flex flex-col justify-between gap-3">
                {task.questionType == "ai" ? null : <img src={`${API_URL}${task.img}`} alt="zdj" className=" " />}
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    {options}
                </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-px bg-gray-300 text-left lg:flex lg:flex-col ">
                <p className="bg-white p-4 flex text-center items-center">Kategoria: {categoriesPL[task.category]}</p>
                <p className="bg-white p-4 flex text-center items-center">Kategoria wiekowa: {ageCatPL[task.ageCategory]}</p>
                <p className="bg-white p-4 flex text-center items-center">Typ zadania: {questionTypePL[task.questionType]}</p>
                <p className="bg-white p-4 flex text-center items-center">Autor: {task.author.firstName} {task.author.lastName}</p>
            </div>


        </section>
    )
}