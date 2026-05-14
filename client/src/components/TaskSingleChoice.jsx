import AnswerButton from "./AnswerButton"
import Cat from "./Cat";
import { useState, useEffect } from "react";
import { useTask } from "./TaskContext";
import api from "../api/api";
import Spinner from "./Spinner";

export default function TaskSingleChoice({ task, block, child }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [result, setResult] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const { setActiveTask, setTaskResult } = useTask();
    const [startTime, setStartTime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLastAttempt = async () => {
            try {
                const query = new URLSearchParams({ taskId: task._id, childId: child });
                if (block) query.append("blockId", block);

                const res = await api.get(`/userTasks/userTask?${query.toString()}`);

                const data = res.data

                if (data) {
                    setAttempt(data)
                    setSelectedIndex(data.selected_answer);
                    setResult(data.correct);
                    console.log(data.correct)
                    console.log(data.selected_answer)
                    setActiveTask(task);
                    setTaskResult(data.correct);
                }
                else {
                    setTaskResult(null);
                    setActiveTask(task);
                    setResult(isCorrect);
                    setAttempt(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLastAttempt();
    }, [task._id, block, child]);

    useEffect(() => {
        setStartTime(Date.now());
    }, [task._id]);

    if (loading) return <Spinner />

    const handleSubmit = async () => {
        if (selectedIndex === null || result !== null) return;

        const endTime = Date.now();
        const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);

        let score = task.difficulty == "easy" ? 10 : 7

        if (timeTakenSeconds > 30) score += 3
        else if (timeTakenSeconds > 20) score += 5
        else if (timeTakenSeconds > 10) score += 7
        else score += 10

        const isCorrect = selectedIndex === task.correctIndex;

        !isCorrect ? score = 0 : null

        try {
            const payload = {
                task: task._id,
                child,
                selected_answer: selectedIndex,
                correct: isCorrect,
                score: score,
                time_taken: timeTakenSeconds
            };
            if (block) payload.block = block;
            else payload.block = task.blockId

            await api.post("/userTasks", payload);

            setResult(isCorrect);
            setTaskResult(isCorrect);
            setActiveTask(task);
        } catch (err) {
            console.error("Błąd zapisu:", err);
        }
    };

    const options = task.options.map((option, index) => <AnswerButton text={option} key={index} checked={selectedIndex === index} result={result}
        isCorrect={index === task.correctIndex}
        onClick={() => {
            if (result !== null) return;
            setSelectedIndex(index);
        }} />)
    return (
        <section className="flex flex-col gap-5">
            <h3 className="text-xl text-blue-950 text-center">{task.text}</h3>
            <div className="flex-col flex gap-5 lg:flex-row lg:items-center ">
                <img src={task.img} alt="alt" className="max-w-9/10 mx-auto max-h-70" />
                <div className=" w-9/10 lg:w-150 mx-auto flex flex-col gap-4">
                    {options}
                </div>
            </div>

            <button
                disabled={selectedIndex === null || result !== null}
                onClick={handleSubmit}
                className="
                    mt-4 px-6 py-3 rounded-4xl text-lg bg-violet-900 text-white w-9/10 lg:w-7/10 mx-auto cursor-pointer hover:bg-violet-950 disabled:opacity-50 disabled:hover:bg-violet-900 disabled:cursor-default font-bold disabled:font-medium">
                Zatwierdź
            </button>

        </section>


    )
}