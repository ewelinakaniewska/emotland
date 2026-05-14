import { useState, useEffect } from "react"
import { useTask } from "./TaskContext";

export default function Cat() {
    const [hidden, setHidden] = useState(false);
    const { activeTask, taskResult } = useTask();
    const [text, setText] = useState("");
    const [isInitial, setIsInitial] = useState(true);

    useEffect(() => {
        if (!activeTask) {

            setText("Wybierz jedną z gwiazdek na mapie i zacznij swoją przygodę. Jeśli będziesz potrzebować pomocy, kliknij na mnie!");
            if (isInitial) {
                setHidden(false);
                setIsInitial(false); 
            }
            else {
                setHidden(true)
            }
        } else {
            if (taskResult !== null) {
                setHidden(false)
                setText(activeTask.explanation || "");
            } else {
                setHidden(true)
                setText(activeTask.hint || "");
            }
        }
    }, [activeTask, taskResult]);

    function handleClick() {
        setHidden(prev => !prev)
    }

    // <a href="https://www.freepik.com/free-psd/hand-drawn-pet-isolated_273641104.htm#from_element=cross_selling__psd">Image by freepik</a>
    return (
        <div className={` transition-all duration-400 fixed -bottom-8 -right-8 ${hidden ? "translate-y-65/100 lg:translate-y-1/3" : "translate-y-0"} cursor-pointer z-50`}
            onClick={handleClick}
        >
            <div className="relative inline-block ">
                <img src="/cat.png" className="block sm:h-80 h-60 " />
                <div>
                    {!hidden && (
                        <>
                            <div
                                className="
                                absolute bottom-full left-0 -translate-x-45 -translate-y-1
                                px-10 py-10 w-12/10  text-center bg-white border shadow-lg 
                                border-1 border-neutral-400 rounded-full text-lg
                            ">
                                {text}
                            </div>

                            <div className=" absolute  rounded-4xl bottom-full left-0 bg-white -translate-x-18 translate-y-17 size-15 border border-1 border-neutral-400">
                            </div>

                            <div className=" absolute  rounded-4xl bottom-full left-0 bg-white -translate-x-5 translate-y-30 size-10 border border-1 border-neutral-400">

                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>

    )
}