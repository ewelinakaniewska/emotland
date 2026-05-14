import { useState, useEffect } from "react";
import api from "../../api/api";
import Input from "../Input"

import ButtonBlueButton from "../ButtonBlueButton"
import TaskCard from "../TaskCard";
import ButtonAmberButton from "../ButtonAmberButton";

export default function ChapterMapStep({ chapter, setChapter, onNext, onPrev }) {
  const [blockTitle, setBlockTitle] = useState("");
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [previewTask, setPreviewTask] = useState(null);

  console.log(chapter.image)

  const API_URL = import.meta.env.VITE_API_URL;

  const validateBlocks = () => {
    if (!chapter.blocks.length) {
      alert("Musisz dodać przynajmniej jeden blok");
      return false;
    }

    const invalidBlock = chapter.blocks.find(
      b => b.tasks.length < 2 || b.tasks.length > 5
    );

    if (invalidBlock) {
      alert(
        `Blok "${invalidBlock.title}" musi mieć od 2 do 5 zadań`
      );
      return false;
    }

    return true;
  };

  const removeBlock = index => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć blok "${chapter.blocks[index].title}"?`
    );

    if (!confirmed) return;

    setChapter(prev => {
      const blocks = [...prev.blocks];
      blocks.splice(index, 1);

      return {
        ...prev,
        blocks
      };
    });

    setSelectedBlockIndex(null);
  };

  const categoriesPL = {
    anger: "Gniew",
    fear: "Strach",
    happiness: "Szczęście",
    sadness: "Smutek",
    surprise: "Zaskoczenie",
    disgust: "Zniesmaczenie"
  };

  const questionTypePL = {
    single_choice: "jednokrotny wybór",
    ai: "naśladaowanie emocji"
  }
  useEffect(() => {
    if (!chapter.ageCategory) return;
    const fetchTasks = async () => {
      const res = await api.get(`/tasks?ageCategory=${chapter.ageCategory}&difficulty=${chapter.difficulty}`);
      setAllTasks(res.data.tasks);
    };
    fetchTasks();
  }, [chapter.ageCategory]);

  const handleAddBlock = e => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    if (!blockTitle) return alert("Podaj nazwę bloku");

    setChapter(prev => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { title: blockTitle, xPercent, yPercent, tasks: [] }
      ]
    }));

    setBlockTitle("");
  };

  const selectBlock = index => setSelectedBlockIndex(index);

  const addTaskToBlock = taskId => {
    if (selectedBlockIndex === null) return;

    setChapter(prev => {
      const blocks = [...prev.blocks];
      const block = { ...blocks[selectedBlockIndex], tasks: [...blocks[selectedBlockIndex].tasks] };

      if (block.tasks.includes(taskId) || block.tasks.length >= 5) return prev;

      block.tasks.push(taskId);
      blocks[selectedBlockIndex] = block;
      return { ...prev, blocks };
    });
  };

  useEffect(() => {
    setSelectedBlockIndex(null);
  }, [chapter.ageCategory, chapter.difficulty]);


  useEffect(() => {
    document.body.style.overflow = previewTask ? "hidden" : "auto";
  }, [previewTask]);


  const removeTaskFromBlock = taskId => {
    if (selectedBlockIndex === null) return;

    setChapter(prev => {
      const blocks = [...prev.blocks];
      const block = { ...blocks[selectedBlockIndex] };
      block.tasks = block.tasks.filter(t => t !== taskId);
      blocks[selectedBlockIndex] = block;
      return { ...prev, blocks };
    });
  };

  const usedTaskIds = chapter.blocks.flatMap(b => b.tasks);

  const availableTasks = allTasks.filter(t => !usedTaskIds.includes(t._id));

  const selectedBlock = selectedBlockIndex !== null ? chapter.blocks[selectedBlockIndex] : null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center">Dodaj bloki</h2>

      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:h-145 gap-5 ">
        <section className="flex flex-col gap-3 bg-white rounded-4xl shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] p-4">
          <Input
            type="text"
            placeholder="Nazwa bloku"
            value={blockTitle}
            onChange={e => setBlockTitle(e.target.value)}
            className="border p-2 rounded"
          />

          {
            chapter.image && <p>Kliknij na obrazek w miejscu, gdzie ma być umieszczony blok</p>
          }
          <div className="relative h-107 w-fit mx-auto " onClick={handleAddBlock}>
            {chapter.image && (
              <img
                src={typeof chapter.image === "string" ? API_URL + chapter.image : URL.createObjectURL(chapter.image)}
                alt="Mapa rozdziału"
                className="mx-auto h-full object-contain pointer-events-none"
              />
            )}

            {chapter.blocks.map((b, i) => (
              <div
                key={i}
                className={`absolute bg-white  text-blue-900 border border-blue-900 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${selectedBlockIndex === i ? "ring-2 ring-blue-500" : ""
                  }`}
                style={{
                  left: `${b.xPercent}%`,
                  top: `${b.yPercent}%`,
                  transform: "translate(-50%, -50%)"
                }}
                title={b.title}
                onClick={e => { e.stopPropagation(); selectBlock(i); }}
              >
                {i + 1}
              </div>
            ))}
          </div>

        </section>

        <section className="lg:h-135 ">
          <h3 className="font-bold text-center">Bloki</h3>
          <p className="text-center lg:text-left">Wybierz blok, aby przypisać do niego zadania</p>
          <div className="w-full lg:max-h-133  max-h-94 p-2 overflow-auto ">

            {chapter.blocks.map((b, i) => (

              <div key={i} className={`bg-white rounded-4xl shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] relative p-5 my-5 flex flex-col justify-center items-center cursor-pointer ${selectedBlock == b ? "border border-2  border-blue-900" : " "} `} onClick={() => selectBlock(i)}>
                <div className="font-bold">{b.title}</div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeBlock(i);
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Usuń blok
                </button>
                <div>
                  {b.tasks.length
                    ? b.tasks.map((tid, i) => {
                      const task = allTasks.find(t => t._id === tid);
                      return task ? (
                        <div key={tid} className="flex flex-row gap-5 items-start gap-2 border-b border-gray-200 p-1  mt-3 p-3">
                          <p className="font-bold">{i + 1}</p>
                          <div className="flex flex-col gap-2">
                            <p>Kategoria: {categoriesPL[task.category]}</p>
                            <p>Typ zadania: {questionTypePL[task.questionType]}</p>
                            <p>Pytanie: {task.text}</p>
                            <div className="flex gap-2">
                              <ButtonAmberButton
                                text="Podgląd"
                                func={() => setPreviewTask(task)}
                              />
                              <ButtonAmberButton text="Usuń" func={() => removeTaskFromBlock(tid)} />
                            </div>

                          </div>

                        </div>
                      ) : null;
                    })
                    : <div className="italic text-gray-500">Brak zadań</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="flex-col">
        <h3 className="font-bold text-center">Dostępne zadania</h3>
        <p className="text-center lg:text-left">Dodaj od 2 do 5 zadań</p>
        <div className="bg-white rounded-4xl shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] p-5 my-5  flex flex-col justify-start items-left overflow-auto max-h-84">

          {availableTasks.length
            ? availableTasks.map(task => (
              <div
                key={task._id}
                className="flex flex-row gap-4 border-b border-gray-300 p-5 w-full"
              >

                <img src={`${API_URL}${task.img}`} alt="zdj" className="h-50 hidden lg:block" />
                <div className="flex flex-col gap-4 ">
                  <p>Kategoria: {categoriesPL[task.category]}</p>
                  <p>Typ zadania: {questionTypePL[task.questionType]}</p>
                  <p>Pytanie: {task.text}</p>
                  <div className="flex gap-2">
                    <ButtonAmberButton
                      text="Podgląd"
                      func={() => setPreviewTask(task)}
                    />

                    <ButtonAmberButton text="Dodaj" func={() => addTaskToBlock(task._id)} />
                  </div>
                </div>

              </div>
            ))
            : <div className="italic text-gray-500">Brak dostępnych zadań</div>
          }
        </div>
      </section>

      <section className="flex gap-2 mt-2 lg:justify-between">
        <ButtonBlueButton func={onPrev} text="Wstecz" />

        <ButtonAmberButton
          text="Dalej"
          func={() => {
            const invalidBlock = chapter.blocks.find(
              b => b.tasks.length < 2 || b.tasks.length > 5
            );

            if (invalidBlock) {
              alert("Każdy blok musi mieć od 2 do 5 zadań");
              return;
            }

            onNext();
          }}
        />

      </section>

      {previewTask && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPreviewTask(null)}
        >
          <div
            className="p-6 max-w-xl w-full relative"
            onClick={e => e.stopPropagation()}
          >

            <button
              onClick={() => setPreviewTask(null)}
              className="absolute top-10 right-17 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <TaskCard task={previewTask} />
          </div>
        </div>
      )}

    </div>
  );
}
