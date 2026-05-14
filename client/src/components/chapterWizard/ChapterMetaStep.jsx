import { useState } from "react";
import Input from "../Input"
import Select from "../Select"
import ButtonAmberButton from "../ButtonAmberButton";

export default function ChapterMetaStep({ chapter, setChapter, onNext, onAgeCategoryChange, onDifficultyChange }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!chapter.title || !chapter.image || !chapter.ageCategory || !chapter.difficulty) {
      setError("Wszystkie pola są wymagane");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-blue-950">Stwórz rozdział</h2>
      {error && <p className="text-red-600">{error}</p>}

      <Input
        type="text"
        placeholder="Tytuł"
        value={chapter.title}
        onChange={e => setChapter(prev => ({ ...prev, title: e.target.value }))}
        className="border p-2 rounded"
      />

      <Select
        value={chapter.ageCategory}
        onChange={e => onAgeCategoryChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Wybierz kategorię wiekową</option>
        <option value="junior">8-11 lat</option>
        <option value="midle">12-13 lat</option>
        <option value="senior">14-16 lat</option>
      </Select>

      <Select
        value={chapter.difficulty}
        onChange={e => onDifficultyChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Wybierz trudność</option>
        <option value="easy">Łatwy</option>
        <option value="hard">Trudny</option>
      </Select>

      <input
        type="file"
        accept="image/*"
        onChange={e => setChapter(prev => ({ ...prev, image: e.target.files[0] }))}
        className="bg-blue-900 text-white p-3 rounded-4xl cursor-pointer hover:bg-blue-950 pl-5 my-2"
      />
      <ButtonAmberButton func={handleNext} text="Dalej" className="self-end"/>
    </div>
  );
}
