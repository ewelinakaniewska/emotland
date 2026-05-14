import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChapterMetaStep from "./ChapterMetaStep";
import ChapterMapStep from "./ChapterMapStep";
import AssignChildrenStep from "./AssignChildrenStep";
import ChapterSummaryStep from "./ChapterSummaryStep";
import LinkButtonBlue from "../LinkButtonBlue"
import Spinner from "../Spinner"
import api from "../../api/api";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function ChapterCreateWizard() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  console.log(chapterId)

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [childrenMap, setChildrenMap] = useState({});

  const navigate = useNavigate();

  const [chapter, setChapter] = useState({
    title: "",
    image: null,
    ageCategory: "",
    difficulty: "",
    blocks: [],
    assignedChildren: []
  });

  useEffect(() => {
    if (!chapterId) return;

    const fetchChapter = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/chapters/${chapterId}`);
        const data = res.data;

        setChapter({
          title: data.title,
          image: data.img || null,
          ageCategory: data.ageCategory,
          difficulty: data.difficulty,
          assignedChildren: data.assignedChildren, 
          blocks: data.blocks.map(b => ({
            ...b,
            tasks: b.tasks.map(t => t._id)
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      const res = await api.get(`/users/therapist/${user}/children`);

      const map = {};
      res.data.forEach(parent => {
        parent.child.forEach(c => {
          map[c._id] = c.name;
        });
      });

      setChildrenMap(map);
    };

    fetchChildren();
  }, [user]);

  const resetTasksInBlocks = blocks =>
    blocks.map(b => ({
      ...b,
      tasks: []
    }));

  const handleAgeCategoryChange = value => {
    if (chapter.blocks.length) {
      const ok = window.confirm(
        "Zmiana kategorii wiekowej usunie wszystkie przypisane zadania. Kontynuować?"
      );
      if (!ok) return;
    }

    setChapter(prev => ({
      ...prev,
      ageCategory: value,
      blocks: resetTasksInBlocks(prev.blocks)
    }));
  };
  const handleDifficultyChange = value => {
    if (chapter.blocks.length) {
      const ok = window.confirm(
        "Zmiana poziomu trudności usunie wszystkie przypisane zadania. Kontynuować?"
      );
      if (!ok) return;
    }

    setChapter(prev => ({
      ...prev,
      difficulty: value,
      blocks: resetTasksInBlocks(prev.blocks)
    }));
  };

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const submitChapter = async () => {
    const formData = new FormData();
    formData.append("title", chapter.title);
    formData.append("image", chapter.image);
    formData.append("ageCategory", chapter.ageCategory);
    formData.append("difficulty", chapter.difficulty);
    formData.append(
      "assignedChildren",
      JSON.stringify(chapter.assignedChildren)
    );
    formData.append("blocks", JSON.stringify(chapter.blocks));

    if (chapterId) {
      await api.put(`/chapters/${chapterId}/full`, formData);
    } else {
      await api.post("/chapters/full", formData);
    }

    alert("Rozdział zapisany!");
    navigate("/dashboard-therapist-chapters")
  };

  if (loading) return <Spinner />
  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-5">
      {step === 1 && (
        <ChapterMetaStep
          chapter={chapter}
          setChapter={setChapter}
          onNext={next}
          onAgeCategoryChange={handleAgeCategoryChange}
          onDifficultyChange={handleDifficultyChange}
        />
      )}

      {step === 2 && (
        <ChapterMapStep
          chapter={chapter}
          setChapter={setChapter}
          onNext={next}
          onPrev={prev}
        />
      )}

      {step === 3 && (
        <AssignChildrenStep
          chapter={chapter}
          setChapter={setChapter}
          onNext={next}
          onPrev={prev}
        />
      )}

      {step === 4 && (
        <ChapterSummaryStep
          chapter={chapter}
          childrenMap={childrenMap}
          onPrev={prev}
          onSubmit={submitChapter}
        />
      )}

      <div className="flex justify-end">
        <LinkButtonBlue
        route="/dashboard-therapist-chapters"
        text="Anuluj"
      />
      </div>
      
    </div>
  );
}
