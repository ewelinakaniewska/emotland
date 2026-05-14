import { useState, useEffect } from "react";
import FilterButton from "./FilterButton";
import ButtonAmberButton from "./ButtonAmberButton";
import { useAuth } from "../auth/useAuth";
import api from "../api/api";

export default function TherapistFilters({ onApply }) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState({
        parent: [],
        child: {},
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
        parent: null,
        child: [], 
        difficulty: [],
        time: "all"
    });

useEffect(() => {
        async function fetchParentsAndChildren() {
            if (!user) return;
            try {
                const res = await api.get(`/users/therapist/${user}/children`);
                
                if (res.data && res.data.length > 0) {
                    const parentOptions = res.data.map(p => ({ _id: p.parentId, name: p.parentName }));
                    const childOptions = {};
                    
                    const allChildIds = [];
                    
                    res.data.forEach(p => { 
                        childOptions[p.parentId] = p.child; 
                        p.child.forEach(c => allChildIds.push(c._id));
                    });

                    setOptions(prev => ({ ...prev, parent: parentOptions, child: childOptions }));

                    const query = new URLSearchParams();
                    allChildIds.forEach(id => query.append("child", id));
                    
                    const tasksRes = await api.get(`/userTasks?${query.toString()}&limit=100`);
                    onApply(tasksRes.data, "all");
                } else {
                    setOptions(prev => ({ ...prev, parent: [], child: {} }));
                    onApply({ filtered: [], total: 0 }, "all"); 
                }
            } catch (err) {
                console.error("Błąd ładowania danych:", err);
                onApply({ filtered: [], total: 0 }, "all");
            }
        }
        fetchParentsAndChildren();
    }, [user]);

    function toggleFilter(filterName, id) {
        setFilters(prev => {
            if (filterName === "parent" || filterName === "time") {
                return {
                    ...prev,
                    [filterName]: prev[filterName] === id ? null : id,
                    ...(filterName === "parent" ? { child: [] } : {})
                };
            }

            const currentSelection = prev[filterName] || [];
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
        setOpen(false);
        const query = new URLSearchParams();

        if (filters.child.length > 0) {
            filters.child.forEach(id => query.append("child", id));
        } 
        else if (filters.parent) {
            const allChildren = options.child[filters.parent] || [];
            allChildren.forEach(c => query.append("child", c._id));
        }

        filters.difficulty.forEach(id => query.append("difficulty", id));

        if (filters.time) query.append("time", filters.time);

        if (options.parent.length > 0) {
            try {
                const url = `/userTasks?${query.toString()}&limit=100`;
                const res = await api.get(url);
                onApply(res.data, filters.time);
            } catch (err) {
                console.error("Błąd filtrowania:", err);
            }
        }
    }

    const renderFilterButtons = (filterName, parentId = null) => {
        const opts = filterName === "child" ? (options.child[parentId] || []) : options[filterName] || [];
        
        return opts.map(opt => {
            const isSelected = Array.isArray(filters[filterName])
                ? filters[filterName].includes(opt._id)
                : filters[filterName] === opt._id;

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
                   py-3 text-center z-20 cursor-pointer text-xl lg:text-2xl lg:font-medium font-light lg:hidden"
            >
                Filtry
            </div>

            <section className={`fixed w-full tracking-wide shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bottom-0 flex flex-col justify-between items-center px-9 py-5 z-30 bg-white transform transition-transform duration-300 ease-in-out
                lg:w-1/4 lg:min-w-90 lg:max-w-120 lg:right-0 lg:top-[var(--nav-height)] lg:h-[calc(100vh-var(--nav-height))] lg:bg-neutral-100 lg:justify-start lg:items-start lg:pt-15 lg:sticky
                ${open ? "translate-y-0" : "translate-y-full"} lg:translate-y-0 overflow-y-auto lg:overflow-visible`}>

                <section className="flex gap-4 items-center text-xl lg:text-2xl lg:font-medium font-light lg:py-6">
                    <img src="/assets/Filter.png" alt="ikona filtra" /> <h3> Filtruj</h3>
                    <button className="absolute right-10 top-5 cursor-pointer lg:hidden" onClick={() => setOpen(false)}>✕</button>
                </section>

                <section className="w-full my-5">
                    <h4 className="mb-4">Rodzic</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">
                        {renderFilterButtons("parent")}
                    </div>
                </section>

                {filters.parent && (
                    <section className="w-full my-5">
                        <h4 className="mb-4">Dziecko</h4>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">
                            {renderFilterButtons("child", filters.parent)}
                        </div>
                    </section>
                )}

                <section className="w-full my-5">
                    <h4 className="mb-4">Poziom trudności</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">
                        {renderFilterButtons("difficulty")}
                    </div>
                </section>

                <section className="w-full my-5 mb-15">
                    <h4 className="mb-4">Okres</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">
                        {renderFilterButtons("time")}
                    </div>
                </section>

                <ButtonAmberButton func={applyFilters} text="Zastosuj" className="self-end" />

            </section>
        </>
    );
}