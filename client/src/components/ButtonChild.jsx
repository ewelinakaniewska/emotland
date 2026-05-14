export default function ButtonChild(props) {
    return (
        <button
            className={`
            flex justify-center gap-3 items-center 
            p-4 bg-white rounded-4xl shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] 
            text-lg font-semibold text-neutral-600 hover:cursor-pointer 
            hover:bg-neutral-300 w-fit   transition-transform duration-200 
            hover:scale-110 
            ${props.class}
            `}
            onClick={props.func}>
            <img src={props.icon} className="size-10" alt="ikona" /> {props.text}
        </button>
    )
}