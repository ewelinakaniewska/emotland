import Nav from "../components/Nav"
import Filters from "../components/Filters"
import { useState } from "react";
import TotalTasksChart from "../components/TaskTimeChart";
import TaskCategoryChart from "../components/TaskCategoryChart"
import PointsCategoryChart from "../components/PointsCategoryChart";
import TimeCategoryChart from "../components/TimeCategoryChart"
import CategoryAccuracyChart from "../components/CategoryAccuracyChart";

export default function ParentStats() {

    const [taskTimeData, setTaskTimeData] = useState([]);
    const [taskCategoryData, setTaskCategoryData] = useState([]);
    const [pointsCategoryData, setPointsCategoryData] = useState([]);
    const [categoryAccuracyData, setCategoryAccuracyData] = useState([]);
    const [timeCategoryData, setTimeCategoryData] = useState([]);

    function handleApplyFilters(data, timeFilter) {

        prepareTaskTimeData(data, timeFilter)

        const taskCategoryData = prepareTaskCategoryData(data);
        setTaskCategoryData(taskCategoryData);

        const pointsCategoryData = preparePointsCategoryData(data)
        setPointsCategoryData(pointsCategoryData)

        const categoryAccuracyData = prepareCategoryAccuracyData(data)
        setCategoryAccuracyData(categoryAccuracyData)

        const timeCategoryData = prepareTimeCategoryData(data)
        setTimeCategoryData(timeCategoryData)

    }


    function prepareTimeCategoryData(data) {

        const ALL_CATEGORIES = ["anger", "fear", "happiness", "sadness", "surprise", "disgust"];

        const tasks = data.filtered;
        if (!tasks?.length) return [];

        const grouped = {};
        tasks.forEach(t => {
            const childId = t.child?._id || t.child;
            const childName = t.child?.name || childId;

            if (!grouped[childName]) grouped[childName] = [];
            grouped[childName].push(t);
        });

        const result = Object.entries(grouped).map(([child, childTasks]) => {
            const categoryTimeTaken = {};
            const categoryCounts = {};

            childTasks.forEach(t => {
                const category = t.task?.category || "Brak kategorii";
                const timeTaken = t.time_taken || 0;

                if (!categoryTimeTaken[category]) categoryTimeTaken[category] = 0;
                if (!categoryCounts[category]) categoryCounts[category] = 0;

                categoryTimeTaken[category] += timeTaken;
                categoryCounts[category] += 1;
            });

            ALL_CATEGORIES.forEach(cat => {
                if (!(cat in categoryCounts)) categoryCounts[cat] = null;
                if (!(cat in categoryTimeTaken)) categoryTimeTaken[cat] = 0;
            });


            const dataForChart = ALL_CATEGORIES.map(cat => ({
                label: cat,
                count: categoryCounts[cat] === null ? undefined : (categoryTimeTaken[cat] / categoryCounts[cat] || 0)
            }));

            return { name: child, data: dataForChart };
        });

        return result;
    }
    function prepareCategoryAccuracyData(data) {
        const ALL_CATEGORIES = ["anger", "fear", "happiness", "sadness", "surprise", "disgust"];
        const tasks = data.filtered;
        if (!tasks?.length) return [];

        const grouped = {};

        tasks.forEach(t => {
            const childName = t.child?.name || t.child?._id || "Unknown";
            if (!grouped[childName]) grouped[childName] = [];
            grouped[childName].push(t);
        });

        return Object.entries(grouped).map(([child, childTasks]) => {
            const categoryMap = {};
            ALL_CATEGORIES.forEach(cat => {
                categoryMap[cat] = { correct: 0, incorrect: 0 };
            });

            childTasks.forEach(t => {
                const category = t.task?.category;
                if (!categoryMap[category]) return;
                if (t.correct) categoryMap[category].correct += 1;
                else categoryMap[category].incorrect += 1;
            });

            const dataForChart = ALL_CATEGORIES.map(cat => {
                const correct = categoryMap[cat].correct;
                const incorrect = categoryMap[cat].incorrect;
                return {
                    label: cat,
                    correct,
                    incorrect,
                    total: correct + incorrect,
                };
            });

            return { name: child, data: dataForChart };
        });
    }

    function prepareTaskCategoryData(data) {

        const ALL_CATEGORIES = ["anger", "fear", "happiness", "sadness", "surprise", "disgust"];

        const tasks = data.filtered;
        if (!tasks?.length) return [];

        const grouped = {};

        tasks.forEach(t => {
            const childId = t.child?._id || t.child;
            const childName = t.child?.name || childId;

            if (!grouped[childName]) grouped[childName] = [];
            grouped[childName].push(t);
        });

        const result = Object.entries(grouped).map(([child, childTasks]) => {
            const categoryMap = {};

            childTasks.forEach(t => {
                const category = t.task?.category || "Brak kategorii";
                if (!categoryMap[category]) categoryMap[category] = 0;
                categoryMap[category]++;
            });

            ALL_CATEGORIES.forEach(cat => {
                if (!categoryMap[cat]) categoryMap[cat] = 0;
            });

            const dataForChart = ALL_CATEGORIES.map(cat => ({
                label: cat,
                count: categoryMap[cat]
            }));

            return { name: child, data: dataForChart };
        });

        return result;
    }

    function preparePointsCategoryData(data) {

        const ALL_CATEGORIES = ["anger", "fear", "happiness", "sadness", "surprise", "disgust"];

        const tasks = data.filtered;
        if (!tasks?.length) return [];

        const grouped = {};
        tasks.forEach(t => {
            const childId = t.child?._id || t.child;
            const childName = t.child?.name || childId;

            if (!grouped[childName]) grouped[childName] = [];
            grouped[childName].push(t);
        });

        const result = Object.entries(grouped).map(([child, childTasks]) => {
            const categoryPoints = {};
            const categoryCounts = {};

            childTasks.forEach(t => {
                const category = t.task?.category || "Brak kategorii";
                const points = t.score || 0;

                if (!categoryPoints[category]) categoryPoints[category] = 0;
                if (!categoryCounts[category]) categoryCounts[category] = 0;

                categoryPoints[category] += points;
                categoryCounts[category] += 1;
            });

            ALL_CATEGORIES.forEach(cat => {
                if (!(cat in categoryCounts)) categoryCounts[cat] = null;
                if (!(cat in categoryPoints)) categoryPoints[cat] = 0;
            });


            const dataForChart = ALL_CATEGORIES.map(cat => ({
                label: cat,
                count: categoryCounts[cat] === null ? undefined : (categoryPoints[cat] / categoryCounts[cat] || 0)
            }));

            return { name: child, data: dataForChart };
        });

        return result;
    }

    function prepareTaskTimeData(data, timeFilter) {

        const tasks = data.filtered;

        if (!tasks?.length) {
            console.log("Brak zadań");
            setTaskTimeData([]);
            return;
        }

        const grouped = {};

        tasks.forEach(t => {
            const childName = t.child.name || "Nieznane dziecko";
            if (!grouped[childName]) grouped[childName] = [];
            grouped[childName].push(t);
        });

        const chartDataPerChild = Object.entries(grouped).map(([child, tasks]) => {

            const dates = tasks.map(t => new Date(t.createdAt)).filter(d => !isNaN(d));
            if (!dates.length) return { name: child, data: [] };

            let minDate = new Date(Math.min(...dates.map(d => d.getTime())));
            let maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

            if (minDate.getTime() === maxDate.getTime()) {
                maxDate = new Date(minDate.getTime() + 24 * 60 * 60 * 1000);
            }

            let intervals = [];
            let labels = [];

            if (timeFilter === "week") {

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 6);

                if (timeFilter === "week") {
                    for (let i = 0; i < 7; i++) {
                        const start = new Date(startDate);
                        start.setDate(startDate.getDate() + i);

                        const end = new Date(start);
                        end.setDate(start.getDate() + 1);

                        intervals.push([start, end]);
                        labels.push(
                            start.toLocaleDateString("pl-PL", { weekday: "short" })
                        );
                    }
                }

            } else if (timeFilter === "all" || timeFilter === null) {
                const rangeDays = Math.ceil((maxDate - minDate) / (24 * 60 * 60 * 1000));
                const numIntervals = rangeDays < 7 ? rangeDays : 7;
                const step = (maxDate - minDate) / numIntervals;

                for (let i = 0; i < numIntervals; i++) {
                    const start = new Date(minDate.getTime() + i * step);
                    const end = new Date(minDate.getTime() + (i + 1) * step);
                    intervals.push([start, end]);

                    const label =
                        start.toLocaleDateString("pl-PL", {
                            day: "numeric",
                            month: "short",
                        }) +
                        " " +
                        String(start.getFullYear()).slice(-2);

                    labels.push(label);
                }
            }
            else if (timeFilter === "month") {
                const rangeDays = Math.ceil((maxDate - minDate) / (24 * 60 * 60 * 1000));
                const numIntervals = rangeDays < 7 ? rangeDays : 7;

                const step = (maxDate - minDate) / numIntervals;
                for (let i = 0; i < numIntervals; i++) {
                    const start = new Date(minDate.getTime() + i * step);
                    const end = new Date(minDate.getTime() + (i + 1) * step);
                    intervals.push([start, end]);
                    const label =
                        start.toLocaleDateString("pl-PL", {
                            day: "numeric",
                            month: "short",
                        })

                    labels.push(label);
                }

            }
            else if (timeFilter === "year") {
                const now = new Date();
                for (let i = 11; i >= 0; i--) {
                    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
                    intervals.push([start, end]);
                    labels.push(
                        start.toLocaleString("pl-PL", { month: "short" })

                    );
                }
            }

            const counts = Array(intervals.length).fill(0);
            tasks.forEach(t => {
                const date = new Date(t.createdAt);
                if (!isNaN(date)) {
                    intervals.forEach(([start, end], idx) => {
                        if (idx === intervals.length - 1) {
                            if (date >= start && date <= end) counts[idx] += 1;
                        } else {
                            if (date >= start && date < end) counts[idx] += 1;
                        }
                    });
                }
            });

            const dataForChart = counts.map((count, idx) => ({
                label: labels[idx],
                count,
            }));

            return { name: child, data: dataForChart };
        });

        setTaskTimeData(chartDataPerChild);
    }

    return (
        <>
            <Nav />
            <section className="flex">

                <main className="w-full p-5 sm:w-8/10 mx-auto grid gap-5 lg:p-10 ">

                    <section className="mb-20 shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5">
                        <h3 className="text-xl mb-5 text-blue-950 font-semibold text-center lg:text-left">Ilość zadań wykonanych w czasie</h3>

                        <div className="wraper lg:flex lg:gap-7">
                            {taskTimeData.map(childChart => (
                                <div key={childChart.name} className="mb-6 lg:w-85/100 lg:max-w-200 lg:flex-1">
                                    <h2 className="text-lg mb-2 text-blue-950 text-center lg:text-left ">{childChart.name}</h2>
                                    <TotalTasksChart data={childChart.data} />
                                </div>
                            ))}
                        </div>

                    </section>

                    <section className="mb-20 shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5">
                        <h3 className="text-xl mb-5 text-blue-950 text-center font-semibold lg:text-left">Ilość wykonanych zadań w zależności od kategorii</h3>
                        <div className="lg:flex lg:gap-7">

                            {taskCategoryData.map(childChart => (
                                <div key={childChart.name} className="mb-6 lg:flex-1 lg:w-85/100 lg:max-w-200">
                                    <h2 className="text-lg mb-2 text-blue-950 text-center lg:text-left">{childChart.name}</h2>
                                    <TaskCategoryChart data={childChart.data} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-20 shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5">
                        <h3 className="text-xl mb-5 text-blue-950 text-center font-semibold lg:text-left">Średnia ilość zdobytych punktów w zależności od kategorii</h3>

                        <div className="lg:flex lg:gap-7">

                            {pointsCategoryData.map(childChart => (
                                <div key={childChart.name} className="mb-6 lg:flex-1 lg:w-85/100 lg:max-w-200">
                                    <h2 className="text-lg mb-2 text-blue-950 text-center lg:text-left">{childChart.name}</h2>
                                    <PointsCategoryChart data={childChart.data} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-20 shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5">
                        <h3 className="text-xl mb-5 text-blue-950 text-center font-semibold lg:text-left" >Poprawność odpowiedzi w zależności od kategorii</h3>
                        <div className="lg:flex lg:gap-7">

                            {categoryAccuracyData.map(childChart => (
                                <div key={childChart.name} className="mb-6 lg:flex-1 lg:w-85/100 lg:max-w-200">
                                    <h2 className="text-lg mb-2 text-blue-950 text-center lg:text-left">{childChart.name}</h2>
                                    <CategoryAccuracyChart data={childChart.data} />
                                </div>
                            ))}
                        </div>
                    </section>

                    < section className="mb-10 shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5">
                        <h3 className="text-xl mb-5 text-blue-950 text-center lg:text-left font-semibold">Czas odpowiedzi w zależności od kategorii</h3>
                        <div className="lg:flex lg:gap-7">

                            {timeCategoryData.map(childChart => (
                                <div key={childChart.name} className="mb-6 lg:flex-1 lg:w-85/100 lg:max-w-200">
                                    <h2 className="text-lg mb-2 text-blue-950 text-center lg:text-left">{childChart.name}</h2>
                                    <TimeCategoryChart data={childChart.data} />
                                </div>
                            ))}
                        </div>
                    </section>

                </main>

                <Filters onApply={handleApplyFilters} />
            </section>


        </>
    )
}
