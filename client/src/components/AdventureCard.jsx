import { useNavigate } from "react-router-dom";

export default function AdventureCard(props) {
    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    let stars = [];
    let difficulty

    if (props.difficulty === "easy") {
        difficulty = 1
    }
    if (props.difficulty === "hard") {
        difficulty = 2
    }

    for (let i = 0; i < difficulty; i++) {
        stars.push(
            <img
                key={i}
                src="star_yellow.svg"
                alt="żółta gwiazdka"
                className="mr-1"
            />
        );
    }

    function handlechapterClick() {
        navigate(`/chapter/${props.id}`);
    }

    return (
        <section className="bg-white rounded-4xl shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] p-5 my-5 flex flex-col justify-center items-center w-120 cursor-pointer"
            onClick={handlechapterClick}
        >
            <div className="flex gap-1 justify-end w-full">
                {stars}
            </div>
            <img src={`${API_URL}${props.img}`} alt="podgląd poziomu" className="h-90" />
            <div className="flex justify-between w-full text-xl font-semibold text-blue-900">
                <span>
                    {props.title}
                </span>

                <span>
                    Ukończono: {props.progress}
                </span>

            </div>
        </section>
    )
}