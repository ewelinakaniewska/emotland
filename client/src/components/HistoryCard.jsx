import ButtonAmberButton from "./ButtonAmberButton";

export default function HistoryCard(props) {

    const d = new Date(props.data.createdAt);
    let difficulty = undefined
    let category = undefined

    if (props.data.task.difficulty == "easy") difficulty = "I"
    if (props.data.task.difficulty == "hard") difficulty = "II"

    switch (props.data.task.category) {
        case "happiness": {
            category = "radość"
            break
        }
        case "sadness":
            {
                category = "smutek"
                break
            }
        case "fear": {
            category = "strach"
            break
        }
        case "disgust":
            {
                category = "wstręt"
                break
            }
        case "surprise": {
            category = "zaskoczenie"
            break
        }
        case "anger": {
            category = "gniew"
            break
        }

    }

    let correct = undefined

    if (props.data.correct === true) correct = "poprawnej"
    if (props.data.correct === false) correct = "niepoprawnej"

    const date = `${d.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit"
    })}  ${d.toLocaleDateString("pl-PL")}`;

    return (
        <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl mb-10 z-2  
            lg:w-9/10 lg:mx-auto 
        ">
            <section className="flex flex-col items-center justify-between relative text-blue-950 gap-5 p-6 lg:items-start 
            ">
                <img src="/assets/history_blob.svg" alt="niebieski kształt" className="absolute right-0 top-0 -z-1 lg:hidden" />

                <div className="absolute inset-0 rounded-4xl overflow-hidden pointer-events-none">
                    <img
                        src="/big_blue_blob.svg"
                        alt=""
                        className="absolute -right-0 -top-0 -z-1 invisible lg:visible"
                    />
                </div>
                <section className="flex flex-col w-full items-center
                lg:flex-row lg:justify-between
                ">
                    <h3 className=" text-lg text-center font-bold lg:mt-0">{props.data.child.name} wykonał/a ćwiczenie</h3>

                    <section className="text-center lg:text-right">
                        <p className="text-lg">{date}</p>
                        <p className="text-blue-900 font-semibold ">{props.data.comment ? "1 komentarz" : null}</p>
                    </section>
                </section>

                <section>
                    <p className="text-lg">Poziom trudności: <span className="text-blue-900 text-lg">{difficulty}</span></p>
                    <p className="text-lg">Kategoria: <span className="text-blue-900 text-lg"  >{category}</span> </p>
                </section>
                <section className="flex flex-col text-center gap-6 lg:flex-row lg:justify-between w-full lg:text-left text-lg">
                    <p className="w-9/10 mx-auto">{props.data.child.name} udzielił/a {correct} odpowiedzi w czasie {props.data.time_taken} sekund</p>
                    <ButtonAmberButton text="Sprawdź" func={props.onOpenPopup} />
                </section>
            </section>
        </section>
    )
}