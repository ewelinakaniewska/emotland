import LinkButtonAmber from "../components/LinkButtonAmber"
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import api from "../api/api"
import Spinner from "../components/Spinner"
import { useAuth } from "../auth/useAuth";
import LinkButtonBlue from "../components/LinkButtonBlue"
import ButtonAmberButton from "../components/ButtonAmberButton";

export default function TherapistChapters() {
  const { user } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) return;

    const fetchChapters = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/chapters/user/${user}`);
        setChapters(res.data);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać rozdziałów");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [user]);

  const ageCatPL = {
    junior: "8-11",
    middle: "12-13",
    senior: "14-16"
  }

  const difficultyPL = {
    easy: "łatwy",
    hard: "trudny"
  }


  if (loading) return <Spinner />;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten rozdział? Wszystkie wyniki uczniów zostaną utracone!")) return;

    try {
      await api.delete(`/chapters/${id}`);
      setChapters(prev => prev.filter(ch => ch._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Nie udało się usunąć rozdziału.");
    }
  };

  return (
    <>
      <Nav />
      <div className="p-5 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-5 text-center">Moje rozdziały</h1>
        <LinkButtonAmber text="Dodaj nowy rozdział" route='/dashboard-therapist-chapters/new' />

        {chapters.length === 0 && (
          <p className="text-center italic text-gray-500">
            Nie masz jeszcze żadnych rozdziałów
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {chapters.map(chapter => (
            <div
              key={chapter._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              {chapter.img && (
                <img
                  src={`${API_URL}${chapter.img}`}
                  alt={chapter.title}
                  className="max-h-40 w-full object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold">{chapter.title}</h2>
                <p className="text-gray-600 mt-2">Kategoria wiekowa: {ageCatPL[chapter.ageCategory]}</p>
                <p className="text-gray-600">Trudność: {difficultyPL[chapter.difficulty]}</p>

                <div className="mt-auto flex justify-between gap-2 items-center pt-4">
                  <span className="text-gray-500 text-sm flex-1">{chapter.blocks?.length || 0} bloków</span>
                  <div className="flex gap-2">
                    <LinkButtonBlue
                      text="Edytuj"
                      route={`/dashboard-therapist-chapters/edit/${chapter._id}`}
                    />
                    <ButtonAmberButton
                      func={() => handleDelete(chapter._id)}
                      text="Usuń"
                    />
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

  );
}
