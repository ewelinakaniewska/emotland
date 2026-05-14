import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Nav from "../components/Nav"
import ButtonAmberButton from "../components/ButtonAmberButton"
import LinkButtonBlue from "../components/LinkButtonBlue"
import Input from "../components/Input";
import { useAuth } from "../auth/useAuth";

export default function ArticleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const { user } = useAuth()


    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!isEdit) return;

        async function fetchArticle() {
            const res = await api.get(`/articles/${id}`);
            const art = res.data;

            setTitle(art.title);
            setText(art.text);
            setCategories(art.category || []);
            setExistingImage(art.images?.[0] || null);
        }

        fetchArticle();
    }, [id]);

    function addCategory(e) {
        if (e.key === "Enter" && categoryInput.trim()) {
            e.preventDefault();
            setCategories(prev => [...new Set([...prev, categoryInput.trim()])]);
            setCategoryInput("");
        }
    }

    function removeCategory(cat) {
        setCategories(prev => prev.filter(c => c !== cat));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            formData.append("category", JSON.stringify(categories));
            if (image) formData.append("image", image);

            if (isEdit) {
                await api.put(`/articles/${id}`, formData);
            } else {
                formData.append("author", user)
                await api.post("/articles", formData);
            }

            navigate("/dashboard-therapist-articles");
        } catch (err) {
            console.error("Błąd zapisu:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Nav />
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center">
                    {isEdit ? "Edytuj artykuł" : "Dodaj artykuł"}
                </h2>

                <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Tytuł"

                    required
                />

                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={15}
                    placeholder="Treść"
                    className="border p-2 rounded-4xl px-6 border-neutral-400 my-1"
                    required
                />

                {existingImage && !image && (
                    <img src={`${API_URL}/${existingImage}`} className="rounded-4xl " />
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImage(e.target.files[0])}
                    className="bg-blue-900 text-white p-3 rounded-4xl cursor-pointer hover:bg-blue-950 pl-5"
                />

                <Input
                    value={categoryInput}
                    onChange={e => setCategoryInput(e.target.value)}
                    onKeyDown={addCategory}
                    placeholder="Dodaj kategorię + Enter"

                />

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <span
                            key={cat}
                            onClick={() => removeCategory(cat)}
                            className="px-3 py-1 bg-amber-200 rounded-full cursor-pointer text-sm"
                        >
                            {cat} ✕
                        </span>
                    ))}
                </div>
                <div className="flex justify-between">
                     <LinkButtonBlue route="/dashboard-therapist-articles" text="Anuluj"/>
                    <ButtonAmberButton text={loading ? "Zapisuję..." : "Zapisz"} disabled={loading} type="submit" />
                </div>

                

            </form>
        </>

    );
}
