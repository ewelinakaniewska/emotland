import Nav from "../components/Nav"
import { useState, useEffect } from "react";
import api from "../api/api";
import Pagination from "../components/Pagination";
import LinkButtonAmber from "../components/LinkButtonAmber"
import TaskFilters from "../components/TasksFilters"
import TaskCard from "../components/TaskCard";
import { useAuth } from "../auth/useAuth";

export default function TherapistTasks() {

    const [taskList, setTaskList] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { role } = useAuth()

    function handleApplyFilters(data) {
        setTaskList(data.tasks);
        setPage(1);
        setTotalPages(Math.ceil(data.total / data.limit));
    }

    useEffect(() => {
        fetchTasks(1);
    }, []);

    async function handleDelete(taskId) {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTaskList(prev => prev.filter(tsk => tsk._id !== taskId));
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchTasks(currentPage = 1, filters = {}) {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...filters
            });

            const res = await api.get(`/tasks?${params.toString()}`);

            setTaskList(res.data.tasks);
            setPage(res.data.page);
            setTotalPages(Math.ceil(res.data.total / res.data.limit));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Nav />
            <section className="flex">
                <main className="p-5 flex flex-col gap-5 w-full">
                    {role == "therapist" && <LinkButtonAmber text="Dodaj nowe zadanie" route='/dashboard-therapist-tasks/new' />}
                    <section className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
                        {taskList.length > 0 ? (
                            taskList.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <p className="mx-auto">Brak zadań</p>
                        )}
                    </section>

                    {taskList.length > 0 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onChange={(newPage) => fetchTasks(newPage)}
                        />
                    )}
                </main>
                <TaskFilters onApply={handleApplyFilters} />
            </section>

        </>
    )
}