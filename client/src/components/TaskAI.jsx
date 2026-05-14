import { useEffect, useRef, useState, useCallback } from "react";
import api from "../api/api";
import Spinner from "./Spinner";
import { useTask } from "./TaskContext";
import ButtonAmberButton from "./ButtonAmberButton";

export default function TaskAI({ task, block, child }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraResetKey, setCameraResetKey] = useState(0);

  const { setActiveTask, setTaskResult } = useTask();

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const query = new URLSearchParams({ taskId: task._id, childId: child });
        if (block) query.append("blockId", block);
        const res = await api.get(`/userTasks/userTask?${query.toString()}`);
        if (res.data) {
          setAttempt(res.data);
          setResult(res.data.correct);
          setTaskResult(res.data.correct);
        } else {
          setResult(null);
          setTaskResult(null);
        }
        setActiveTask(task);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [task._id, block, child, setTaskResult, setActiveTask]);

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });
      
      if (!videoRef.current) return;

      streamRef.current = stream;
      setCameraAvailable(true);
      setErrorMessage("");

      const video = videoRef.current;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.muted = true;

      video.onloadedmetadata = () => {
        video.play().catch(e => console.error("Play error:", e));
      };
      
      setTimeout(() => {
        if (video.paused) video.play().catch(() => {});
      }, 500);

    } catch (err) {
      console.error("Kamera Error:", err);
      setCameraAvailable(false);
      setErrorMessage(err.name === "NotAllowedError" ? "Brak uprawnień do kamery." : "Nie udało się uruchomić kamery.");
    }
  }, []);

  useEffect(() => {
    if (!loading && !attempt && !capturedImageUrl && result === null) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [loading, cameraResetKey, capturedImageUrl, result, attempt, startCamera]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [task._id]);

  const captureImage = () => {
    if (!videoRef.current) return null;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/jpeg"));
  };

  const handleSubmit = async () => {
    if (analyzing || result !== null || attempt !== null) return;
    setAnalyzing(true);
    try {
      const blob = await captureImage();
      const formData = new FormData();
      formData.append("image", blob);

      const aiRes = await api.post("/tasks/predictEmotion", formData);
      const isCorrect = aiRes.data.label === task.category;
      
      await api.post("/userTasks", {
        task: task._id,
        child,
        correct: isCorrect,
        time_taken: Math.floor((Date.now() - startTime) / 1000),
        attempt: aiRes.data.label,
        block: block || task.blockId
      });

      setCapturedImageUrl(URL.createObjectURL(blob));
      setResult(isCorrect);
      setTaskResult(isCorrect);
    } catch (e) {
      setErrorMessage("Wystąpił błąd analizy.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCameraRetry = () => {
    setCameraAvailable(true); 
    setErrorMessage("");
    setCameraResetKey(prev => prev + 1);
  };

  if (loading) return <Spinner />;
  const isBlocked = attempt && block && attempt.block === block;

  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-xl text-center text-blue-950">{task.text}</h3>

      <div className="flex justify-center min-h-[300px] relative lg:min-w-140">
        {isBlocked ? (
          <div className="bg-blue-50/50 rounded-2xl w-full max-w-md p-8 text-center border-2 border-blue-100 flex flex-col justify-center items-center">
            <p className="font-bold text-blue-900">Zadanie ukończone!</p>
          </div>
        ) : !cameraAvailable ? (
          <div className="bg-gray-200 rounded-2xl w-full max-w-md p-8 text-center flex flex-col justify-center items-center">
             <p className="text-blue-900 font-bold mb-4">Kamera nie działa</p>
             <p className="text-sm mb-6 px-4">{errorMessage}</p>
             <button 
                onClick={handleCameraRetry} 
                className="bg-amber-600 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-amber-700 font-bold"
             >
                Spróbuj ponownie
             </button>
          </div>
        ) : !capturedImageUrl ? (
          <video 
            key={cameraResetKey}
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="rounded-2xl bg-black w-full max-w-md aspect-video object-cover shadow-2xl" 
          />
        ) : (
          <img 
            src={capturedImageUrl} 
            className="rounded-2xl object-cover w-full max-w-md aspect-video shadow-2xl" 
            alt="Captured" 
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="min-h-[60px] flex flex-col justify-center">
        {result !== null && (
          <div className={`text-center py-3 px-8 font-semibold ${result ? "text-green-700" : "text-red-700"}`}>
            {result ? "Dobra odpowiedź!" : "Spróbuj jeszcze raz w powtórkach"}
          </div>
        )}
        {errorMessage && cameraAvailable && !isBlocked && (
          <p className="text-center text-red-600 font-bold">{errorMessage}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isBlocked ? (
          <div className="text-center text-slate-400 py-4 font-bold uppercase tracking-widest">
            Ukończono
          </div>
        ) : (result === null) ? (
          <ButtonAmberButton 
            text={analyzing ? "Sprawdzam..." : "Zatwierdź"} 
            func={handleSubmit} 
            disabled={analyzing || !cameraAvailable || !!capturedImageUrl} 
          />
        ) : (
          <div className="text-center text-slate-400 py-4 font-bold uppercase tracking-widest">
            Zadanie zakończone
          </div>
        )}
      </div>
    </section>
  );
}