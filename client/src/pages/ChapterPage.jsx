import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import api from "../api/api";
import { useTask } from "../components/TaskContext";
import ButtonChild from "../components/ButtonChild";
import Cat from "../components/Cat";
import SettingsChildPopup from "../components/SettingsChildPopup";
import MedalsChildPopup from "../components/MedalsChildPopup";
import Block from "../components/Block";
import { useAuth } from "../auth/useAuth";

export default function ChapterPage() {

  const navigate = useNavigate()

  const { id } = useParams();
  const { logout } = useAuth()
  const { user } = useAuth()
  const [chapterData, setChapterData] = useState()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [medalsOpen, setMedalsOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(null)
  const [progress, setProgress] = useState(0)
  const [blocks, setBlocks] = useState()
  const [totalTasks, setTotalTasks] = useState(0)
  const [tasksToReview, setTasksToReview] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(null)
  const [reload, setReload] = useState(false);

  const { setActiveTask, setTaskResult } = useTask();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchChapter = async () => {
      const chapterRes = await api.get(`/chapters/${id}`);
      setChapterData(chapterRes.data);
    };
    const fetchReview = async () => {
      const reviewRes = await api.get(`chapters/${id}/review?childId=${user}`)
      setTasksToReview(reviewRes.data)
    }

    fetchChapter();
    fetchReview();
  }, [id, reload]);


  useEffect(() => {
    if (!chapterData) return;

    let totalCorrect = 0;
    let totalTasks = 0;

    const loadBlocks = async () => {
      const list = await Promise.all(
        chapterData.blocks.map(async block => {
          const res = await api.get(
            `/userTasks/${block._id}/completed?childId=${user}`
          );

          const stats = res.data.stats;
          const status = res.data.status;

          totalCorrect += stats.correct;
          totalTasks += stats.totalTasks;

          return (
            <div
              key={block._id}
              className="size-10 md:size-12 rounded-full bg-neutral-200 absolute cursor-pointer flex justify-center items-center hover:scale-110 transition-all"
              style={{
                left: `${block.xPercent}%`,
                top: `${block.yPercent}%`,
                transform: "translate(-50%, -50%)"
              }}

              onClick={() => setBlockOpen(block)}
            >
              {status === "COMPLETED_ALL_CORRECT" && (
                <img src="/star_yellow.svg" alt="żółta gwiazdka" />
              )}
              {status === "ATTEMPTED_ALL_NOT_ALL_CORRECT" && (
                <img src="/red_star.svg" alt="czerwona gwiazdka" />
              )}
              {status === "INCOMPLETE" && (
                <>

                  <img src="/gray_star2.svg" className="animate-pulse" />
                </>
              )}
              <p className="absolute -bottom-6 font-semibold">
                {stats.correct} / {stats.totalTasks}
              </p>
            </div>
          );
        })
      );

      setProgress(totalCorrect);
      setTotalTasks(totalTasks);
      setBlocks(list);
    };

    loadBlocks();
  }, [chapterData, reload, user]);

  if (!chapterData || !tasksToReview) return <Spinner />;

  return (


    <div className="bg-blue-300 min-h-dvh p-2 ">

      {
        blockOpen && <div className="fixed inset-0 bg-black/50 z-40">
          <Block block={blockOpen} onClose={() => {
            setBlockOpen(null)
            setActiveTask(null);
            setTaskResult(null);
            setReload(prev => !prev);
          }
          } />
        </div>
      }

      {
        reviewOpen && <div className="fixed inset-0 bg-black/50 z-40 ">
          <Block block={reviewOpen} onClose={() => {
            setReviewOpen(null)
            setActiveTask(null);
            setTaskResult(null);
          }
          } />
        </div>
      }
      {settingsOpen &&
        <div className="fixed inset-0 bg-black/50 z-50">
          <SettingsChildPopup onClose={() => setSettingsOpen(false)} />
        </div>
      }
      {medalsOpen &&
        <div className="fixed inset-0 bg-black/50 z-50">
          <MedalsChildPopup onClose={() => setMedalsOpen(false)} />
        </div>
      }
      <nav className="flex flex-wrap  gap-4 lg:justify-end justify-center">

        <ButtonChild text="Powrót" icon="/arrow_back_gray.svg" class="" func={() => { navigate('/dashboard-child-mainpanel') }} />

        {/* TODO */}
        {/* <ButtonChild text="Ustawienia" icon="/settings.svg" func={() => setSettingsOpen(true)} />
        <ButtonChild text="Nagrody" icon="/star.svg" func={() => setMedalsOpen(true)} /> */}


        <ButtonChild text="Wyloguj się" icon="/logout.svg" func={logout} />
      </nav>
      <h1 className="text-center text-4xl my-7 font-semibold tracking-widest mx-auto lg:text-5xl">{chapterData.title}</h1>
      <main className=" flex flex-col lg:flex-row lg:gap-7 lg:justify-center">

        <div className="lg:order-2 flex-col lg:flex-1 max-w-200 mx-auto lg:mx-0 lg:mr-auto">
          <div className="lg:order-2 flex flex-col lg:justify-start justify-center">
            <p className="text-lg text-center my-4 lg:text-xl lg:text-left "> Wykonano poprawnie <span className="font-semibold text-blue-950">{progress}/{totalTasks}</span> zadań</p>
            {
              tasksToReview.tasks.length > 0 ?
                <p className="text-center mb-4 text-lg lg:text-xl lg:text-left">Aby ukończyć poziom powtórz zadania, w których się pomyliłeś </p> : null
            }

            {
              tasksToReview.tasks.length > 0 &&
              <ButtonChild text="Powtórka" icon="/star.svg" class="mx-auto lg:mx-0"
                func={() => setBlockOpen(tasksToReview)} />
            }
          </div>

          <div className=" flex flex-col gap-2 lg:w-auto w-8/10 mx-auto">
            <p className="text-lg text-center my-4 lg:text-xl font-bold lg:text-left "> Co to znaczy?</p>
            <section className="flex gap-3 items-center">
              <div className="size-10 md:size-12 rounded-full bg-neutral-200  flex justify-center items-center flex-none ">

                <img src="/star_yellow.svg" alt="żółta gwiazdka" />
              </div>
              <p className="text-gray-800 text-xl"><strong>Super!</strong> Wszystko udało Ci się rozwiązać bezbłędnie.</p>
            </section>
            <section className="flex gap-3 items-center">
              <div className="size-10 md:size-12 rounded-full bg-neutral-200  flex justify-center items-center flex-none">
                <img src="/red_star.svg" alt="czerwona gwiazdka" />
              </div>
              <p className="text-gray-800 text-xl"><strong>Spróbuj jeszcze raz!</strong> Zajrzyj do <strong>Powtórek</strong>, żeby poćwiczyć i zmienić tę gwiazdkę w złotą!</p>
            </section>
            <section className="flex gap-3 items-center">
              <div className="size-10 md:size-12 rounded-full bg-neutral-200  flex justify-center items-center flex-none">

                <img src="/gray_star2.svg" />
              </div>
              <p className="text-gray-800 text-xl"><strong>Twoja nowa przygoda!</strong> Kliknij tutaj i sprawdź, co Cię czeka.</p>
            </section>

          </div>

        </div>


        <div className="lg:ml-auto mx-auto lg:mx-0 relative mb-5 ">
          <img src={`${API_URL}${chapterData.img}`} alt={chapterData.title} className="max-h-200 min-h-100" />
          {blocks}
        </div>
        <Cat />
      </main>
    </div>
  )
}