import Nav from "../components/Nav"
import TherapistFilters from "../components/TherapistFilters"
import { useState } from "react";
import TotalTasksChart from "../components/TaskTimeChart";
import TaskCategoryChart from "../components/TaskCategoryChart"
import PointsCategoryChart from "../components/PointsCategoryChart";
import TimeCategoryChart from "../components/TimeCategoryChart"

import CategoryAccuracyChart from "../components/CategoryAccuracyChart";

export default function TherapistStats() {

    const [chartsData, setChartsData] = useState({});

    function groupByParent(data) {
        if (!data?.filtered?.length) return {};

        const result = {};

        data.filtered.forEach(t => {
            const parentName = t.parent?.parentName || "Brak przypisanego rodzica";
            const childName = t.child?.name || "Nieznane dziecko";

            if (!result[parentName]) {
                result[parentName] = {};
            }

            if (!result[parentName][childName]) {
                result[parentName][childName] = [];
            }

            result[parentName][childName].push(t);
        });

        return result;
    }

    function handleApplyFilters(data, timeFilter) {
        const grouped = groupByParent(data);

        const dataPerChild = {};

        Object.entries(grouped).forEach(([parentName, children]) => {
            dataPerChild[parentName] = {};
            Object.entries(children).forEach(([childName, tasks]) => {
                dataPerChild[parentName][childName] = {
                    taskTime: prepareTaskTimeData({ filtered: tasks }, timeFilter)[0]?.data || [],
                    taskCategory: prepareTaskCategoryData({ filtered: tasks })[0]?.data || [],
                    pointsCategory: preparePointsCategoryData({ filtered: tasks })[0]?.data || [],
                    categoryAccuracy: prepareCategoryAccuracyData({ filtered: tasks })[0]?.data || [],
                    timeCategory: prepareTimeCategoryData({ filtered: tasks })[0]?.data || [],
                };
            });
        });

        setChartsData(dataPerChild);

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
                for (let i = 0; i < 7; i++) {
                    const start = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + i);
                    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                    intervals.push([start, end]);
                    labels.push(start.toLocaleDateString("pl-PL", { weekday: "short" }));
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

        return chartDataPerChild

    }

    return (
        <>
            <Nav />
            <section className="flex">

                <main className="w-full p-5 sm:w-8/10 mx-auto grid gap-10 lg:p-10">

                    <h1 className="text-4xl text-center my-5 font-semibold text-blue-900">Statystyki</h1>

                    {(!chartsData || Object.keys(chartsData).length === 0) ? (
                        <div className="text-center text-gray-500 p-10 text-xl">
                            Brak danych
                        </div>
                    ) : (
                        Object.entries(chartsData).map(([parentName, children]) => (
                            <section
                                key={parentName}
                                className="shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5"
                            >
                                <h2 className="text-2xl font-semibold text-blue-950 mb-6 text-center lg:text-left">
                                    Rodzic:&nbsp;
                                    <span className="text-blue-900">
                                        {parentName}
                                    </span>
                                </h2>

                                {Object.entries(children).map(([childName, charts]) => (
                                    <div key={childName} className="mb-10">
                                        <h3 className="text-xl text-center lg:text-left font-semibold text-blue-950 mb-5">
                                            Dziecko: {childName}
                                        </h3>
                                        <div className="flex flex-col lg:flex-row lg:flex-wrap  gap-10">

                                            <section className="mb-10 lg:w-85/100 lg:max-w-130 lg:flex lg:flex-col lg:justify-between ">
                                                <h3 className="text-xl mb-5 text-blue-950 font-medium text-center lg:text-left">Ilość zadań wykonanych w czasie</h3>
                                                <TotalTasksChart data={charts.taskTime} />
                                            </section>

                                            <section className="mb-10 lg:w-85/100 lg:max-w-130  lg:flex lg:flex-col lg:justify-between ">
                                                <h3 className="text-xl mb-5 text-blue-950 text-center font-medium lg:text-left">Ilość wykonanych zadań w zależności od kategorii</h3>
                                                <TaskCategoryChart data={charts.taskCategory} />
                                            </section>

                                            <section className="mb-10 lg:w-85/100 lg:max-w-130 lg:flex lg:flex-col lg:justify-between ">
                                                <h3 className="text-xl mb-5 text-blue-950 text-center font-medium lg:text-left">Średnia ilość zdobytych punktów w zależności od kategorii</h3>
                                                <PointsCategoryChart data={charts.pointsCategory} />
                                            </section>

                                            <section className="mb-10 lg:w-85/100 lg:max-w-130 lg:flex lg:flex-col lg:justify-between ">
                                                <h3 className="text-xl mb-5 text-blue-950 text-center font-medium lg:text-left" >Poprawność odpowiedzi w zależności od kategorii</h3>
                                                <CategoryAccuracyChart data={charts.categoryAccuracy} />
                                            </section>

                                            <section className="mb-10 lg:w-85/100 lg:max-w-130 lg:flex lg:flex-col lg:justify-between ">
                                                <h3 className="text-xl mb-5 text-blue-950 text-center lg:text-left font-medium">Czas odpowiedzi w zależności od kategorii</h3>
                                                <TimeCategoryChart data={charts.timeCategory} />
                                            </section>
                                        </div>

                                    </div>
                                ))}
                            </section>
                        )))}
                </main>

                <TherapistFilters onApply={handleApplyFilters} />
            </section>


        </>
    )
}
