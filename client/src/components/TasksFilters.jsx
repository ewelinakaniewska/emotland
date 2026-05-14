import { useState, useEffect } from "react";
import Input from "./Input";
import Select from "./Select";
import FilterButton from "./FilterButton";
import ButtonAmberButton from "./ButtonAmberButton";
import api from "../api/api";

export default function TaskFilters({ onApply, limit = 10 }) {
    const [open, setOpen] = useState(false);

    const categoriesPL = {
        anger: "Gniew",
        fear: "Strach",
        happiness: "Radość",
        sadness: "Smutek",
        surprise: "Zaskoczenie",
        disgust: "Wstręt"
    };

    const ageCatPL = {
        junior: "8-11",
        middle: "12-13",
        senior: "14-16"
    };

    const questionTypePL = {
        single_choice: "jednokrotny wybór",
        ai: "naśladowanie emocji"
    };

    const [options, setOptions] = useState({
        categories: [],
        authors: [],
        questionType: [],
        ageCategory: [],
        difficulty: [
            { _id: "easy", name: "łatwy" },
            { _id: "hard", name: "trudny" }
        ]
    });

    const [filters, setFilters] = useState({
        category: null,     
        author: null,       
        search: "",         
        questionType: [],   
        ageCategory: [],   
        difficulty: [],     
    });

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [categories, questionTypesres, ageCategories, authors] = await Promise.all([
                    api.get("/tasks/categories"),
                    api.get("/tasks/questionTypes"),
                    api.get("/tasks/ageCategories"),
                    api.get("/tasks/authors")
                ]);

                setOptions(prev => ({
                    ...prev,
                    questionType: Array.isArray(questionTypesres.data) ? questionTypesres.data.map(cat => ({
                        _id: cat,
                        name: questionTypePL[cat] || cat
                    })) : [],
                    categories: categories.data,
                    ageCategory: ageCategories.data.map(cat => ({
                        _id: cat,
                        name: ageCatPL[cat] || cat
                    })),
                    authors: authors.data
                }));
            } catch (err) {
                console.error("Błąd pobierania opcji:", err);
            }
        }
        fetchOptions();
    }, []);

    function toggleFilter(filterName, value) {
        setFilters(prev => {
            const currentSelection = prev[filterName];

            if (!Array.isArray(currentSelection)) {
                return { ...prev, [filterName]: currentSelection === value ? null : value };
            }

            const isSelected = currentSelection.includes(value);
            return {
                ...prev,
                [filterName]: isSelected
                    ? currentSelection.filter(item => item !== value)
                    : [...currentSelection, value]
            };
        });
    }

    async function applyFilters() {
        setOpen(false);
        const query = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (!value || value === "all" || value === "") return;

            if (Array.isArray(value)) {
                value.forEach(v => query.append(key, v));
            } else {
                query.append(key, value);
            }
        });

        const url = `/tasks?${query.toString()}&limit=${limit}`;

        try {
            const res = await api.get(url);
            onApply(res.data);
        } catch (err) {
            console.error("Błąd przy pobieraniu zadań:", err);
        }
    }

    const renderButtons = (filterName) => {
        return (options[filterName] || []).map(opt => {
            const isSelected = filters[filterName].includes(opt._id);

            return (
                <FilterButton
                    key={opt._id}
                    label={opt.name}
                    value={opt._id}
                    isSelected={isSelected}
                    selectedValue={isSelected ? opt._id : null} 
                    onClick={() => toggleFilter(filterName, opt._id)}
                />
            );
        });
    };

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.15)] py-3 text-center z-20 cursor-pointer text-xl lg:text-2xl lg:font-medium font-light lg:hidden"
            >
                Filtry
            </div>

            <section className={` fixed w-full tracking-wide shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bottom-0 flex flex-col justify-between items-center px-9 py-5 z-30 bg-white transform transition-transform duration-300 ease-in-out max-h-9/10  overflow-auto
                lg:w-1/4 lg:min-w-90 lg:max-w-120 lg:right-0 lg:top-[var(--nav-height)] lg:h-[calc(100vh-var(--nav-height))] lg:bg-neutral-100 lg:justify-start lg:items-start lg:pt-15 lg:sticky lg:max-h-none
                ${open ? "translate-y-0" : "translate-y-full"}
                lg:translate-y-0 `}>
                
                <section className="flex gap-4 items-center text-xl lg:text-2xl lg:font-medium font-light lg:mb-1">
                    <img src="/assets/Filter.png" alt="filtr" /> <h3>Filtruj zadania</h3>
                    <button className="absolute right-10 top-5 cursor-pointer lg:hidden" onClick={() => setOpen(false)}>✕</button>
                </section>

                <section className="w-full my-5 flex flex-col">
                    <h4 className="mb-1">Szukaj</h4>
                    <Input
                        type="text"
                        placeholder="Szukaj w treści..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </section>

                <section className="flex flex-col mb-4 w-full">
                    <h2 className="mb-1">Kategoria emocji</h2>
                    <Select
                        value={filters.category || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, category: e.target.value || null }))
                        }
                    >
                        <option value="">Wszystkie</option>
                        {options.categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {categoriesPL[cat] || cat}
                            </option>
                        ))}
                    </Select>
                </section>

                <section className="flex flex-col w-full mb-4">
                    <h2 className="mb-1">Autor</h2>
                    <Select
                        value={filters.author || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, author: e.target.value || null }))
                        }
                    >
                        <option value="">Wszyscy</option>
                        {options.authors.map((author) => (
                            <option key={author._id} value={author._id}>
                                {author.name}
                            </option>
                        ))}
                    </Select>
                </section>

                <section className="w-full my-3">
                    <h4 className="mb-2 font-medium">Typ zadania</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {renderButtons("questionType")}
                    </div>
                </section>

                <section className="w-full my-3">
                    <h4 className="mb-2 font-medium">Kategoria wiekowa</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {renderButtons("ageCategory")}
                    </div>
                </section>

                <section className="w-full my-3 mb-8">
                    <h4 className="mb-2 font-medium">Poziom trudności</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {renderButtons("difficulty")}
                    </div>
                </section>

                <ButtonAmberButton func={applyFilters} text="Zastosuj filtry" />
            </section>
        </>
    );
}