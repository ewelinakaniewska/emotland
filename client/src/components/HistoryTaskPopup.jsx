import { useState, useEffect } from "react"
import api from "../api/api"
import Spinner from "../components/Spinner";
import { useAuth } from "../auth/useAuth";
import ButtonAmberButton from "./ButtonAmberButton";

export default function HistoryTaskPopup({ data, onClose, onCommentChange }) {
    const [currentTask, setCurrentTask] = useState()
    const [expandedComment, setExpandedComment] = useState(false);

    const [comment, setComment] = useState(data.comment || "");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const { role } = useAuth()

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put(`/userTasks/${data._id}`, { comment });
            setComment(res.data.comment);
            setSuccess(true);

            if (onCommentChange) {
                onCommentChange(data._id, res.data.comment);
            }

        } catch (err) {
            console.error("Błąd zapisu komentarza:", err);
            setSuccess(false);
        } finally {
            setSaving(false);
        }
    };

    const EMOTION_PL = {
        anger: "złość",
        disgust: "wstręt",
        fear: "strach",
        happiness: "radość",
        neutral: "neutralna",
        sadness: "smutek",
        surprise: "zaskoczenie",
    };

    useEffect(() => {
        getData()
    }
        , [])

    async function getData() {
        const res = await api.get(`/tasks/${data.task._id}`);
        setCurrentTask(res.data)
        console.log(res)
    }

    if (!currentTask) {
        return (
            <Spinner />
        );
    }

    const options = currentTask.options.map((opt, index) => {
        return <button key={index} className={`w-full bg-blue-200 py-5 rounded-xl`}>{opt}</button>
    })

    return (
        <div className="w-full bg-white m-2 rounded-4xl p-5 relative flex flex-col justify-between items-center gap-5 sm:max-w-150 lg:w-4/5 lg:max-w-200 lg:p-7 lg:items-start">
            <button className="absolute right-7 top-5 cursor-pointer" onClick={onClose}>✕</button>

            <section className="w-full">

                <p className="font-semibold text-2xl  text-center my-5 mt-7">{currentTask.text}</p>
                {currentTask.img ? <img src={currentTask.img} alt="obrazek do ćwiczenia" className=" max-h-100 mx-auto" /> :
                    <div className="grid content-center text-center bg-gray-300 min-h-52 text-lg  rounded-4xl"> Zadanie z pokazywania emocji</div>}
            </section>

            <section className="grid grid-cols-2 w-full gap-3 ">
                {options}
            </section>

            <section className="lg:flex lg:w-full lg:gap-5 text-center lg:text-left">
                <div className="lg:basis-1/2 ml-1">
                    {currentTask.questionType == "ai" ? <p className="">{data.child.name} pokazała emocję:  <span className="text-blue-900">{EMOTION_PL[data.attempt]}</span></p> : <p className="">{data.child.name} udzielił/a odpowiedzi: <span className="text-blue-900">{currentTask.options[data.selected_answer]}</span></p>}
                    {currentTask.questionType == "ai" ? <p className="mb-3 lg:mb-0">Wymagana emocja to: <span className="text-blue-900">{EMOTION_PL[currentTask.category]}</span></p> : <p className="mb-3 lg:mb-0">Poprawna odpowiedź to: <span className="text-blue-900">{currentTask.options[currentTask.correctIndex]}</span></p>}

                </div>

                {(data.comment && role == "parent") &&
                    <div className="lg:basis-1/2">
                        <p className="text-center lg:text-left mb-1 lg:mb-0">Komentarz:</p>
                        <p className={`${expandedComment ? "line-clamp-none" : "line-clamp-2"} cursor-pointer text-center w-8/9 mx-auto lg:w-full lg:mx-0 lg:text-left`}
                            onClick={() => setExpandedComment(!expandedComment)}
                        >{data.comment}</p>
                    </div>
                }
                {role == "therapist" &&
                    <div className="lg:basis-1/2 w-full flex flex-col gap-2">
                        <p className="text-center lg:text-left mb-1 lg:mb-0">Komentarz:</p>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border rounded p-2 w-full"
                            rows={4}
                        />
                        <ButtonAmberButton
                            func={handleSave}
                            disabled={saving}
                            className="self-end"
                            text={saving ? "Zapisuję..." : "Zapisz komentarz"}
                        />
                        {success && <p className="text-green-600">Zapisano!</p>}
                    </div>
                }
            </section>

        </div>
    )
}