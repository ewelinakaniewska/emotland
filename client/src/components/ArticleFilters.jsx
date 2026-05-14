import { useState, useEffect } from "react";

import Input from "./Input";
import Select from "./Select";
import FilterButton from "./FilterButton";
import ButtonAmberButton from "./ButtonAmberButton";
import api from "../api/api";

export default function ArticleFilters({ onApply, limit = 5 }) {
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState({
        categories: [],
        authors: [],
        period: [
            { _id: "week", name: "Tydzień" },
            { _id: "month", name: "Miesiąc" },
            { _id: "year", name: "Rok" },
            { _id: "all", name: "Wszystko" }
        ]
    });

    const [filters, setFilters] = useState({
        category: null,
        author: null,
        period: "all",
        search: "",
        sort: "date"
    });

    useEffect(() => {
        async function fetchOptions() {
            const [cats, authors] = await Promise.all([
                api.get("/articles/categories"),
                api.get("/articles/authors")
            ]);

            setOptions(prev => ({
                ...prev,
                categories: cats.data,
                authors: authors.data
            }));
        }

        fetchOptions();
    }, []);

    function toggleFilter(filterName, value) {
        setFilters(prev => ({
            ...prev,
            [filterName]: prev[filterName] === value ? null : value
        }));
    }

    async function applyFilters() {

        console.log(filters)
        setOpen(false);
        const query = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all" && value !== "") {
                query.append(key, value);
            }
        });

        const url = `/articles?${query.toString()}&limit=${limit}`;

        console.log(url)

        try {
            const res = await api.get(url);
            onApply(res.data);
            console.log(res.data)
        } catch (err) {
            console.error("Błąd przy pobieraniu artykułów:", err);
        }
    }

    const renderButtons = (filterName) => {
        return (options[filterName] || []).map(opt => (
            <FilterButton
                key={opt._id}
                label={opt.name}
                value={opt._id}
                selectedValue={filters[filterName]}
                onClick={() => toggleFilter(filterName, opt._id)}
            />
        ));
    };

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.15)] py-3 text-center z-20 cursor-pointer text-xl lg:text-2xl lg:font-medium font-light lg:hidden"
            >
                Filtry
            </div>

            <section className={` overflow-auto fixed w-full tracking-wide shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bottom-0 flex flex-col max-h-9/10 justify-between items-center px-9 py-5 z-30 bg-white transform transition-transform duration-300 ease-in-out
        lg:w-1/4 lg:min-w-90 lg:max-w-120 lg:right-0 lg:top-[var(--nav-height)] lg:h-[calc(100vh-var(--nav-height))] lg:bg-neutral-100 lg:justify-start lg:items-start lg:pt-15 lg:sticky lg:max-h-none
        ${open ? "translate-y-0" : "translate-y-full"}
        lg:translate-y-0 `}>
                <section className="flex gap-4 items-center text-xl lg:text-2xl lg:font-medium font-light lg:mb-1">
                    <img src="/assets/Filter.png" alt="filtr" /> <h3>Filtruj</h3>
                    <button className="absolute right-10 top-5 cursor-pointer lg:hidden" onClick={() => setOpen(false)}>✕</button>
                </section>

                <section className="w-full my-5 flex flex-col">
                    <h4 className="mb-1">Szukaj</h4>
                    <Input
                        type="text"
                        placeholder="W tytule lub treści..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </section>

                <section className="flex flex-col mb-4 w-full">
                    <h2 className="mb-1">Kategoria</h2>
                    <Select
                        value={filters.category || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, category: e.target.value || null }))
                        }
                    >
                        <option value="">Wszystkie</option>
                        {options.categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
                </section>

                <section className="flex flex-col w-full">
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

                <section className="w-full my-5">
                    <h4 className="mb-4">Okres</h4>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-2">
                        {renderButtons("period")}
                    </div>
                </section>

                <section className="w-full mb-5">
                    <h4 className="mb-2">Sortuj według</h4>
                    <div className="flex gap-2">
                        {["date", "title"].map((type) => (
                            <FilterButton
                                key={type}
                                label={type === "date" ? "Data" : "Tytuł"}
                                value={type}
                                selectedValue={filters.sort}
                                onClick={() => setFilters((prev) => ({ ...prev, sort: type }))}
                            />
                        ))}
                    </div>
                </section>
                <section className="w-full mb-7">
                    <h4 className="mb-2">Kierunek</h4>
                    <div className="flex gap-2">
                        {["asc", "desc"].map((dir) => (
                            <FilterButton
                                key={dir}
                                label={dir === "asc" ? "Rosnąco" : "Malejąco"}
                                value={dir}
                                selectedValue={filters.order}
                                onClick={() => setFilters((prev) => ({ ...prev, order: dir }))}
                            />
                        ))}
                    </div>
                </section>

                <ButtonAmberButton func={applyFilters} text="Zastosuj" className="self-end" />
            </section>
        </>
    );
}
