export default function AnswerButton({ text, checked, onClick, result, isCorrect }) {
  let bg = "bg-blue-900";
  let interaction = "cursor-pointer hover:bg-blue-950";

  if (result !== null) {
    interaction = "cursor-default";

    if (isCorrect) bg = "bg-green-700";
    else if (checked) bg = "bg-red-700";
  }
  else if (checked) {
    bg = "bg-amber-600 font-bold ";
    interaction = "hover:bg-amber-700 cursor-pointer"
  }

  return <div
    onClick={result === null ? onClick : undefined}
    className={`
        py-4 px-3 text-center rounded-4xl text-xl
        text-white transition-colors
        ${bg}
        ${interaction}
      `}
  >
    {text}
  </div>
}