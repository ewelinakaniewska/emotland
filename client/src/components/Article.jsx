import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { NavLink } from "react-router-dom";

export default function Article({ art, onDelete }) {

    const [expanded, setExpanded] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const { role } = useAuth()
    const { user } = useAuth()

    console.log(`${API_URL}/${art.images[0]}`)

    function checkAuthor() {
        if (role === "therapist" && art.authorId == user) {
            return true
        }
        else return false
    }

    const catList = art.category.map((cat => {
        return <span className="inline-block px-4 py-2 mb-2 text-sm font-semibold bg-amber-200 text-blue-900 my-auto rounded-full" key={cat}> {cat} </span>
    }))

    return (
        <article className="mb-20 shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:text-left lg:p-7">

            <div className={`flex flex-row  ${checkAuthor() ? " justify-between " : "justify-center "}`}>
                <span className="flex flex-wrap justify-center gap-1 lg:justify-start">
                    {catList}
                </span>
                {
                    checkAuthor() ?
                        <section className="flex gap-2 items-center">
                            <button className="p-0 m-0" onClick={() => onDelete(art._id)}>
                                <img src="trashcan.svg" alt="ikona kosza na śmieci" className="size-9 cursor-pointer hover:scale-110 transition-all" />
                            </button>
                            <NavLink to={`/dashboard-therapist-articles/edit/${art._id}`}>
                                <img src="edit.svg" alt="ikona kosza na śmieci" className="size-8 cursor-pointer hover:scale-110 transition-all" />
                            </NavLink>
                        </section> :
                        null
                }
            </div>

            <div className="flex justify-between text-gray-500 my-2">
                <span>{art.author?.name || art.author}</span>
                <span>{new Date(art.createdAt).toLocaleDateString()}</span>
            </div>

            <h3 className="text-xl font-semibold mb-2">{art.title}</h3>

            {art.images?.length > 0 && (
                <img src={`${API_URL}/${art.images[0]}`} alt="zdj" className="mb-2 rounded mx-auto lg:mr-auto lg:ml-0" />

            )}

            <section className="mb-2">
                <p className={`text-gray-800 ${!expanded ? "line-clamp-3" : ""}`}>
                    {art.text}
                </p>
                {art.text.length > 200 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-blue-900 mt-1  font-medium hover:underline"
                    >
                        {expanded ? "Zwiń" : "Czytaj dalej"}
                    </button>
                )}
            </section>

            <p></p>
        </article>
    );
}
