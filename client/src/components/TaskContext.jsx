import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [activeTask, setActiveTask] = useState(null);
  const [taskResult, setTaskResult] = useState(null);

  return (
    <TaskContext.Provider value={{
      activeTask,
      setActiveTask,
      taskResult,
      setTaskResult
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => useContext(TaskContext);
