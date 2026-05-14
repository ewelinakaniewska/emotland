import Nav from "../components/Nav"
import ArticleFilters from "../components/ArticleFilters"
import { useState, useEffect } from "react"
import api from "../api/api"
import Article from "../components/Article"
import Pagination from "../components/Pagination";
import { useAuth } from "../auth/useAuth"
import LinkButtonAmber from "../components/LinkButtonAmber"

export default function Articles() {
    const [artList, setArtList] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { role } = useAuth()

    async function handleDelete(articleId) {
        try {
            await api.delete(`/articles/${articleId}`);
            setArtList(prev => prev.filter(art => art._id !== articleId));
        } catch (err) {
            console.error(err);
        }
    }

    function handleApplyFilters(data) {
        setArtList(data.articles);
        setPage(1);
        setTotalPages(Math.ceil(data.total / data.limit));
    }

    useEffect(() => {
        fetchArticles(1);
    }, []);

    async function fetchArticles(currentPage = 1, filters = {}) {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 5,
                ...filters
            });
            const res = await api.get(`/articles?${params.toString()}`);

            setArtList(res.data.articles);
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
                    {role == "therapist" && <LinkButtonAmber text="Dodaj nowy artykuł" route='/dashboard-therapist-articles/new' />}
                    {artList.length > 0 ? (
                        artList.map(art => (
                            <Article
                                key={art._id}
                                art={art}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <p className="mx-auto">Brak artykułów</p>
                    )}

                    {artList.length > 0 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onChange={(newPage) => fetchArticles(newPage)}
                        />
                    )}
                </main>

                <ArticleFilters onApply={handleApplyFilters} />
            </section>

        </>

    )
}