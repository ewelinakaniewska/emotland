import { useState, useEffect, useLayoutEffect } from "react";
import FilterButton from "./FilterButton";
import ButtonAmberButton from "./ButtonAmberButton"
import { useAuth } from "../auth/useAuth";
import api from "../api/api";

export default function Filters({ onApply, limit, sortBy }) {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const [options, setOptions] = useState({
        child: [],
        difficulty: [
            { _id: "easy", name: "I" },
            { _id: "hard", name: "II" }
        ],
        time: [
            { _id: "week", name: "Tydzień" },
            { _id: "month", name: "Miesiąc" },
            { _id: "year", name: "Rok" },
            { _id: "all", name: "Wszystko" }
        ]
    });

    const [filters, setFilters] = useState({
        child: [], 
        difficulty: [],
        time: "all"
    });

    useEffect(() => {
    if (options.child && options.child.length > 0) {
        applyFilters();
    }
}, [options.child]); 
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await api.get(`/users/children/${user}`);
                const child = res.data;
                setOptions(prev => ({ ...prev, child }));
            } catch (err) {
                console.error("Błąd pobierania dzieci:", err);
            }
        }
        fetchUsers();
    }, [user]);

    function toggleFilter(filterName, id) {
        setFilters(prev => {
            if (filterName === "time") {
                return { ...prev, [filterName]: id };
            }

            const currentSelection = prev[filterName];
            const isSelected = currentSelection.includes(id);

            return {
                ...prev,
                [filterName]: isSelected
                    ? currentSelection.filter(item => item !== id)
                    : [...currentSelection, id]
            };
        });
    }

    async function applyFilters() {
        const query = new URLSearchParams();
        setOpen(false);

        if (filters.child.length === 0) {
            options.child.forEach(c => query.append("child", c._id));
        } else {
            filters.child.forEach(id => query.append("child", id));
        }

        filters.difficulty.forEach(id => query.append("difficulty", id));

        if (filters.time) query.append("time", filters.time);

        const url = `/userTasks?${query.toString()}&limit=100`;
        const res = await api.get(url);
        onApply(res.data, filters.time);
    }

   const renderFilterButtons = (filterName) => {
    return (options[filterName] || []).map(opt => {
        const isSelected = filterName === "time" 
            ? filters.time === opt._id 
            : filters[filterName].includes(opt._id);

        return (
            <FilterButton
                key={opt._id}
                label={opt.name}
                value={opt._id}
                isSelected={isSelected} 
                selectedValue={isSelected ? opt._id : null} 
                onClick={(value) => toggleFilter(filterName, value)}
            />
        );
    });
};

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.15)]
                           py-3 text-center z-20 cursor-pointer
                           text-xl lg:text-2xl lg:font-medium font-light
                           lg:hidden "
            >
                Filtry
            </div>

            <section className={` 
            fixed w-full tracking-wide shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bottom-0 flex flex-col 
            justify-between items-center px-9 py-5 z-30 bg-white transform transition-transform duration-300 
            ease-in-out lg:w-1/4 lg:min-w-90 lg:max-w-120 lg:right-0 lg:top-[var(--nav-height)] 
            lg:h-[calc(100vh-var(--nav-height))] lg:bg-neutral-100 lg:justify-start lg:items-start lg:pt-15 lg:sticky
            ${open ? "translate-y-0" : "translate-y-full"}
            lg:translate-y-0 `
            }>

                <section className="flex gap-4 items-center text-xl lg:text-2xl lg:font-medium font-light lg:py-6">
                    <img src="/assets/Filter.png" alt="ikona filtra" /> <h3> Filtruj</h3>
                    <button className="absolute right-10 top-5 cursor-pointer lg:hidden" onClick={() => setOpen(false)}>✕</button>
                </section>

                <section className="w-full my-5 ">
                    <h4 className=" mb-4">Dziecko</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">{renderFilterButtons("child")}</div>
                </section>
                <section className="w-full my-5 ">
                    <h4 className="mb-4">Poziom trudności</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">{renderFilterButtons("difficulty")}</div>
                </section>
                <section className="w-full my-5 mb-15 ">
                    <h4 className=" mb-4">Okres</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">{renderFilterButtons("time")}</div>
                </section>

                <ButtonAmberButton func={applyFilters} text="Zastosuj" className="self-end" />

            </section>

        </>
    )
}