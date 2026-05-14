import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Nav from "../components/Nav";
import Select from "../components/Select";
import ButtonAmberButton from "../components/ButtonAmberButton";
import LinkButtonBlue from "../components/LinkButtonBlue"
import Input from "../components/Input";
import { useAuth } from "../auth/useAuth";

export default function TaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    const [text, setText] = useState("");
    const [questionType, setQuestionType] = useState("single_choice");
    const [options, setOptions] = useState([]);
    const [optionInput, setOptionInput] = useState("");
    const [correctIndex, setCorrectIndex] = useState(0);
    const [category, setCategory] = useState("");
    const [ageCategory, setAgeCategory] = useState("junior");
    const [difficulty, setDifficulty] = useState("easy");
    const [hint, setHint] = useState("");
    const [explanation, setExplanation] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEdit) return;

        async function fetchTask() {
            const res = await api.get(`/tasks/${id}`);
            const task = res.data;

            setText(task.text);
            setQuestionType(task.questionType);
            setOptions(task.options || []);
            setCorrectIndex(task.correctIndex ?? 0);
            setCategory(task.category);
            setAgeCategory(task.ageCategory);
            setDifficulty(task.difficulty);
            setHint(task.hint || "");
            setExplanation(task.explanation || "");
            setExistingImage(task.img || null);
        }

        fetchTask();
    }, [id, isEdit]);

    function addOption(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();

        if (!optionInput.trim()) return;
        if (options.length >= 4) return;

        setOptions(prev => [...prev, optionInput.trim()]);
        setOptionInput("");
    }

    useEffect(() => {
        if (questionType !== "single_choice") {
            setImage(null);
        }
    }, [questionType]);


    function removeOption(index) {
        setOptions(prev => prev.filter((_, i) => i !== index));
        if (index === correctIndex) setCorrectIndex(0);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();


            formData.append("text", text);
            formData.append("questionType", questionType);
            formData.append("options", JSON.stringify(options));
            formData.append("correctIndex", correctIndex);
            formData.append("category", category);
            formData.append("ageCategory", ageCategory);
            formData.append("difficulty", difficulty);
            formData.append("hint", hint);
            formData.append("explanation", explanation);

            if (image) formData.append("image", image);
            formData.append("author", user);

            if (isEdit) {
                await api.put(`/tasks/${id}`, formData);
            } else {
                await api.post("/tasks", formData);
            }

            navigate("/dashboard-therapist-tasks");
        } catch (err) {
            console.error("Błąd zapisu zadania:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Nav />

            <form onSubmit={handleSubmit} className="max-w-250 mx-auto p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center">
                    {isEdit ? "Edytuj zadanie" : "Dodaj zadanie"}
                </h2>

                <section className="flex flex-col w-full">
                    <label htmlFor="taskFormText">Pytanie</label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        rows={4}
                        id="taskFormText"
                        placeholder="Treść pytania"
                        className="border p-2 rounded-4xl px-6 border-neutral-400 my-1"
                        required
                    />
                </section>

                <section className="flex flex-col w-full">

                    <label htmlFor="taskFormQuestionType" className="mb-1">Typ zadania</label>
                    <Select value={questionType} id="taskFormQuestionType" onChange={e => setQuestionType(e.target.value)} >
                        <option value="single_choice">Jednokrotny wybór</option>
                        <option value="ai">Naśladowanie emocji</option>
                    </Select>

                </section>

                <section className="flex flex-col  w-full ">

                    {questionType === "single_choice" && (
                        <>
                            <label htmlFor="taskFormAnswers">Odpowiedzi</label>

                            <Input value={optionInput}
                                id="taskFormAnswers"
                                onChange={e => setOptionInput(e.target.value)}
                                onKeyDown={addOption}
                                placeholder={
                                    options.length >= 4
                                        ? "Maks. 4 odpowiedzi"
                                        : "Dodaj odpowiedź + Enter"
                                }
                                disabled={options.length >= 4} />


                            <div className="flex flex-wrap gap-2 mt-3">
                                {options.map((opt, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-2 rounded-full cursor-pointer text-sm flex items-center gap-2
                                        ${correctIndex === idx ? "bg-green-300" : "bg-amber-200"}
                                    `}
                                    >
                                        <input
                                            type="radio"
                                            checked={correctIndex === idx}
                                            onChange={() => setCorrectIndex(idx)}
                                        />
                                        {opt}
                                        <span onClick={() => removeOption(idx)}>✕</span>
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <section className="flex flex-col w-full">
                    <label htmlFor="taskFormCategory">Kategoria</label>

                    <Select
                        id="taskFormCategory"
                        value={category || ""}
                        onChange={e => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Wszystkie</option>

                        <option key={"happiness"} value={"happiness"}>
                            Radość
                        </option>

                        <option key={"anger"} value={"anger"}>
                            Gniew
                        </option>

                        <option key={"fear"} value={"fear"}>
                            Strach
                        </option>

                        <option key={"surprise"} value={"surprise"}>
                            Zaskoczeneie
                        </option>

                        <option key={"disgust"} value={"disgust"}>
                            Wstręt
                        </option>

                        <option key={"sadness"} value={"sadness"}>
                            Smutek
                        </option>

                    </Select>
                </section>


                <section className="flex flex-col w-full">
                    <label htmlFor="taskFormAgeCategory">Kategoria wiekowa</label>
                    <Select value={ageCategory}
                        id="taskFormAgeCategory"
                        onChange={e => setAgeCategory(e.target.value)}>
                        <option value="junior">8-11 lat</option>
                        <option value="middle">12-13 lat</option>
                        <option value="senior">14-16 lat</option>
                    </Select>
                </section>

                <section className="flex flex-col  w-full">
                    <label htmlFor="taskFormDifficulty">Poziom trudności</label>
                    <Select value={difficulty}
                        id="taskFormDifficulty"
                        onChange={e => setDifficulty(e.target.value)}>
                        <option value="easy">Łatwy</option>
                        <option value="hard">Trudny</option>

                    </Select>
                </section>

                <section className="flex flex-col  w-full">
                    <label htmlFor="taskFormHint">Podpowiedź</label>
                    <Input value={hint}
                        id="taskFormHint"
                        onChange={e => setHint(e.target.value)}
                        placeholder="Podpowiedź" />
                </section>

                <section className="flex flex-col  w-full">
                    <label htmlFor="taskFormImage">Wyjaśnienie</label>
                    <textarea
                        value={explanation}
                        id="taskFormImage"
                        onChange={e => setExplanation(e.target.value)}
                        rows={3}
                        placeholder="Wyjaśnienie"
                        className="border p-2 rounded-4xl px-6 border-neutral-400 my-1"
                    />

                </section>

                <section className="flex flex-col  w-full">
                    <label htmlFor="taskFormImage">Zdjęcie</label>
                    {
                        (questionType === "single_choice" && existingImage && !image) && (
                            <img
                                src={`${API_URL}${existingImage}`}
                                className="rounded-4xl mt-1"
                            />
                        )}

                    <input
                        type="file"
                        id="taskFormImage"
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])}
                        className="bg-blue-900 text-white p-3 rounded-4xl cursor-pointer hover:bg-blue-950 pl-5 my-2"
                        style={{ display: questionType === "single_choice" ? "block" : "none" }}
                    />

                </section>
                <div className="flex lg:justify-between gap-2">


                <LinkButtonBlue
                    route="/dashboard-therapist-tasks"
                    text="Anuluj"
                />
                <ButtonAmberButton
                    text={loading ? "Zapisuję..." : "Zapisz"}
                    disabled={loading}
                    type="submit"
                />
                </div>

            </form>
        </>
    );
}
