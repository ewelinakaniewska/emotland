import Filters from "../components/Filters";
import TherapistFilters from '../components/TherapistFilters'
import Nav from "../components/Nav";
import HistoryCard from "../components/HistoryCard"
import HistoryTaskPopup from "../components/HistoryTaskPopup";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";


export default function ParentHistory() {

    const [historyList, setHistoryList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const user = useAuth()



    function handleApplyFilters(data, timeFilter) {
        const tasks = data.filtered
        const list = tasks.map(task => {
            return <HistoryCard key={task._id} data={task} onOpenPopup={() => handleOpenPopup(task)} />
        })
        setHistoryList(list);
    }

    function handleOpenPopup(task) {
        setSelectedTask(task);
    }
    function handleCommentChange(taskId, newComment) {
        setHistoryList(prev =>
            prev.map(card => {
                if (card.props.data._id === taskId) {
                    const newData = { ...card.props.data, comment: newComment };
                    return <HistoryCard key={taskId} data={newData} onOpenPopup={() => handleOpenPopup(newData)} />
                }
                return card;
            })
        );

        setSelectedTask(prev =>
            prev && prev._id === taskId ? { ...prev, comment: newComment } : prev
        );
    }

    function handleClosePopup() {
        setSelectedTask(null);
    }

    return (
        <>
            <Nav />
            <section className="flex">

                <main className="w-full p-5 sm:w-8/10 mx-auto flex flex-col gap-5 lg:p-10 relative ">
                    <h1 className="text-4xl text-center my-10 font-semibold text-blue-900">Historia</h1>
                    {historyList.length > 0 ? historyList : <p className="text-center text-lg">Brak danych</p>}
                    {selectedTask && (
                        <section className="absolute fixed inset-0 bg-black/50 z-45 flex justify-center items-center">
                            <HistoryTaskPopup data={selectedTask} onClose={handleClosePopup} onCommentChange={handleCommentChange} />
                        </section>
                    )}

                </main>
                {user.role == "therapist" ? <TherapistFilters onApply={handleApplyFilters} limit={10} sortBy="createdAt" /> : <Filters onApply={handleApplyFilters} limit={10} sortBy="createdAt" />}

            </section>

        </>);
}