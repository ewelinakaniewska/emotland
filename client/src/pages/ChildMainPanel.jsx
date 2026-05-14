import ButtonChild from "../components/ButtonChild"
import AdventureCard from "../components/AdventureCard"
import Spinner from "../components/Spinner"
import SettingsChildPopup from "../components/SettingsChildPopup"
import MedalsChildPopup from "../components/MedalsChildPopup"
import api from "../api/api";
import { useAuth } from "../auth/useAuth";
import { useState, useEffect } from "react"

export default function ChildMainPanel() {

    const { user } = useAuth();
    const { logout } = useAuth();

    const childId = user

    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [medalsOpen, setMedalsOpen] = useState(false)

    useEffect(() => {
        const loadChapters = async () => {
            try {
                setLoading(true);

                const [chaptersRes, progressRes] = await Promise.all([
                    api.get(`/chapters?assignedChildren=${childId}`),
                    api.get(`/chapters/progress/${childId}`)
                ]);

                const chaptersData = chaptersRes.data
                const progressData = progressRes.data

                const merged = chaptersData.map(ch => {
                    const p = progressData.chapterProgress.find(
                        x => x.chapterId === ch._id
                    );

                    return {
                        ...ch,
                        progressLabel: p ? p.progressLabel : "0/0",
                        completedBlocks: p ? p.completedBlocks : 0,
                        totalBlocks: p ? p.totalBlocks : 0
                    };
                });
                setChapters(merged);
            } catch (err) {
                console.error("Error loading chapters:");
            } finally {
                setLoading(false);
            }
        };

        loadChapters();
    }, [childId]);

    if (loading) return <Spinner />

    const cards = chapters.map(chapter => {
        return (<AdventureCard key={chapter._id} difficulty={chapter.difficulty} img={chapter.img} title={chapter.title} progress={chapter.progressLabel} id={chapter._id} />)
    }
    )

    // <a href="https://www.freepik.com/free-vector/medal-2_35202535.htm#fromView=search&page=1&position=9&uuid=ef77555a-f09b-442f-abce-084932bfbc7c&query=medal+icon+">Image by juicy_fish on Freepik</a>
    return (
        <div className="bg-blue-300 min-h-dvh p-2">

            {settingsOpen &&
                <div className="fixed inset-0 bg-black/50">
                    <SettingsChildPopup onClose={() => setSettingsOpen(false)} />
                </div>
            }
            {medalsOpen &&
                <div className="fixed inset-0 bg-black/50">
                    <MedalsChildPopup onClose={() => setMedalsOpen(false)} />
                </div>
            }

            <nav className="flex flex-wrap  gap-4 justify-end">

                {/* TODO */}
                {/* <ButtonChild text="Nagrody" icon="star.svg" func={() => setMedalsOpen(true)} />
                <ButtonChild text="Ustawienia" icon="settings.svg" func={() => setSettingsOpen(true)} /> */}
                
                <ButtonChild text="Wyloguj się" icon="logout.svg" func={logout} />
            </nav>
            <main className="mt-10" >
                <h1 className="text-4xl text-blue-950 tracking-widest font-bold text-center  mb-4">Kraina emocji </h1>
                <h2 className="text-3xl text-blue-950 tracking-wide font-semibold text-center  ">Wybierz swoją przygodę</h2>
                <section className="flex flex-wrap justify-center  gap-5">
                    {cards}
                </section>
            </main>
        </div>


    )
}