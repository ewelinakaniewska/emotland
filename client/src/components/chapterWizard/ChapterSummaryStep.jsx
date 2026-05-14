import ButtonBlueButton from "../ButtonBlueButton";
import ButtonAmberButton from "../ButtonAmberButton";

export default function ChapterSummaryStep({
  chapter,
  childrenMap,
  onPrev,
  onSubmit
}) {
  const difficulty = {
    easy: "łatwy",
    hard: "trudny"
  };

  const ageCatPL = {
    junior: "8–11",
    middle: "12–13",
    senior: "14–16"
  };

  return (
    <div className="bg-white rounded-4xl p-5 shadow flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-blue-900">
        Podsumowanie rozdziału
      </h2>

      <div>
        <strong>Tytuł:</strong> {chapter.title}
      </div>

      <div>
        <strong>Kategoria wiekowa:</strong>{" "}
        {ageCatPL[chapter.ageCategory]} lat
      </div>

      <div>
        <strong>Trudność:</strong> {difficulty[chapter.difficulty]}
      </div>

      <div>
        <strong>Bloki:</strong>
        <ul>
          {chapter.blocks.map((b, i) => (
            <li key={i}>
              {b.title} ({b.tasks.length} zadań)
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Dzieci:</strong>
        <ul>
          {chapter.assignedChildren.map(id => (
            <li key={id}>{childrenMap[id] ?? "—"}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 mt-4 lg:justify-between">
        <ButtonBlueButton func={onPrev} text="Wstecz" />
        <ButtonAmberButton func={onSubmit} text="Zapisz rozdział" />
      </div>
    </div>
  );
}
