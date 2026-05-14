export default function FormStep(props) {
  return (
    <div className="max-w-1/3">
      <span
        className={`rounded-full inline-block h-12 w-12 lg:size-11 grid content-center font-semibold text-xl mb-2  ${
          props.active ? "bg-blue-900 text-white border-none" : "border border-neutral-400 border-2 text-neutral-400"
        }`}
      >
        {props.number}
      </span>
      <p className={`${props.active ? " text-blue-900 " : " text-neutral-400 "}`}>
        {props.label}
      </p>
    </div>
  );
}
