import { useState } from "react";
import TaskSingleChoice from "./TaskSingleChoice";
import { useAuth } from "../auth/useAuth";
import TaskAI from "./TaskAI";

export default function Block({ onClose, block }) {
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0);

  if (block.tasks.length == 0) {
    console.log("kot debugger")
    return (<div className="bg-white w-9/10 p-4 h-fit min-h-200 max-w-220 max-h-220 fixed shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] flex flex-col items-center justify-start rounded-4xl flex  left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
      <button onClick={onClose} className=" ml-auto cursor-pointer">X</button>

      <p>Brak zadań do powtórki</p>
    </div>)
  }

  const currentTask = block.tasks[currentIndex];

  return (
    <div className="bg-white p-4 lg:p-10 w-9/10 lg:max-w-275 lg:w-fit fixed shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] flex flex-col rounded-4xl flex  left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40 max-h-9/10 overflow-auto md:max-h-none md:overflow-none">
      <button onClick={onClose} className=" ml-auto mb-auto cursor-pointer">X</button>

      <h2 className="text-xl text-blue-900 text-center">{block.title}</h2>

      {block.tasks[currentIndex].questionType === "single_choice" && <TaskSingleChoice key={currentTask._id} task={currentTask} block={block._id} child={user} />}
      {block.tasks[currentIndex].questionType === "ai" && <TaskAI key={currentTask._id} task={currentTask} block={block._id} child={user} />}

      <div className="flex justify-between mt-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="px-3 py-1 rounded bg-blue-900 hover:bg-blue-950 disabled:opacity-50 disabled:hover:bg-blue-900 text-white font-bold text-xl  disabled:cursor-default cursor-pointer "
        >
          ←
        </button>

        <span>
          {currentIndex + 1} / {block.tasks.length}
        </span>

        <button
          disabled={currentIndex === block.tasks.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="px-3 py-1 rounded bg-blue-900 hover:bg-blue-950 disabled:opacity-50 disabled:hover:bg-blue-900 text-white font-bold text-xl  disabled:cursor-default cursor-pointer"
        >
          →
        </button>
      </div>

    </div>
  )
}