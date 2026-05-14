export default function SettingsChildPopup(props) {
    return (
        <div className="bg-white w-9/10 p-4 h-100 fixed shadow-[0px_0px_27px_-18px_rgba(66,68,90,1)] rounded-4xl flex  left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[9999]">
            <button onClick={props.onClose} className=" ml-auto mb-auto cursor-pointer">X</button>
        </div>
    )
}