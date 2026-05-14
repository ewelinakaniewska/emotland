import { useState, useEffect, useRef } from "react";

function ContactTile({ contact, isActive, onClick, currentUser }) {

  const last = contact.lastMessage;

  const messageText = last
    ? (last.from === currentUser ? "Ty: " : "") + last.content
    : "Brak wiadomości";

  const date = last ? new Date(last.createdAt) : null;

  const sendAt = date
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div
      className={`px-4 py-3 cursor-pointer flex items-center gap-3 
        ${isActive ? "bg-blue-900 text-white" : "bg-neutral-100 text-black"}
        hover:bg-blue-900 hover:text-white`}
      onClick={onClick}
    >
      <span className="size-12 bg-neutral-200 inline-block rounded-full"></span>

      <span className="flex flex-col justify-between w-7/10">
        <span className="text-lg">{contact.firstName} {contact.lastName}</span>
        <span className="font-light line-clamp-2 ">{messageText}</span>
      </span>

      <span className="ml-auto">{sendAt}</span>
    </div>
  );
}

export default function ChatSidebar({ contacts, activeContact, onSelect, currentUser }) {
  const [open, setOpen] = useState(true);
  const sidebarRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (!activeContact) return;
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeContact]);


  function handleClose() {
    if (!activeContact) return;
    setOpen(false);
  }

  return (
    <>
      {activeContact && (
        <div className="fixed top-[var(--nav-height)] h-20 left-0 w-full bg-white p-3 flex items-center justify-start gap-5 z-10 shadow-md
        lg:hidden"
        >
          <button
            className="cursor-pointer "
            onClick={() => setOpen(true)}
          >
            <img src="arrow_back.svg" alt="" />
          </button>

          <span className="size-12 bg-neutral-200 inline-block rounded-full
                "></span>
          <span className="text-blue-950 text-xl ">
            {activeContact.firstName} {activeContact.lastName}
          </span>


        </div>
      )}

      <div
        ref={sidebarRef}
        className={`
          fixed top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))] 
          left-0 w-3/4 md:w-1/4 bg-neutral-100 shadow-md overflow-y-auto py-3 z-10
          transform transition-transform duration-300 ease-in-out 
          ${open ? "translate-x-0" : "-translate-x-full"}  
          lg:translate-x-0 lg:static lg:max-w-100 lg:min-w-80 `}
      >
        {contacts.length === 0 ? (
          <div className="p-4 text-gray-500">Brak dostępnych kontaktów</div>
        ) : (
          contacts.map((contact) => (
            <ContactTile
              key={contact._id}
              contact={contact}
              isActive={activeContact?._id === contact._id}
              onClick={() => {
                onSelect(contact);
                setOpen(false);
              }}
              currentUser={currentUser}
            />
          ))
        )}
      </div>

    </>
  );
}
