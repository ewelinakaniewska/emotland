import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/api";
import { io } from "socket.io-client";
import { useAuth } from "../auth/useAuth";
import Nav from "../components/Nav";
import Sidebar from "../components/ChatSidebar";
import MessageTile from "../components/MessageTile";

const socket = io("http://localhost:5000");

export default function ChatWindow() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const currentUser = user;

  useEffect(() => {
    if (!currentUser) return;

    const fetchContacts = async () => {
      try {
        const res = await api.get(`/users/contacts/${currentUser}`);
        setContacts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchContacts();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleReceive = useCallback(
    (message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
      scrollToBottom();
    },
    []
  );

  useEffect(() => {
    if (!activeContact) return;

    socket.emit("join", currentUser);
    socket.on("receiveMessage", handleReceive);

    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/messages/conversation/${currentUser}/${activeContact._id}`
        );
        setMessages(Array.isArray(res.data) ? res.data : []);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    return () => socket.off("receiveMessage", handleReceive);
  }, [activeContact, currentUser, handleReceive]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;

    try {
      await api.post("/messages", {
        from: currentUser,
        to: activeContact._id,
        content: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const messagesList = messages.map((msg, index) => {
    const prevMsg = messages[index - 1];
    const showDateSeparator =
      !prevMsg ||
      new Date(prevMsg.createdAt).toDateString() !==
      new Date(msg.createdAt).toDateString();

    return (
      <React.Fragment key={msg._id}>
        {showDateSeparator && (
          <div className="text-center text-gray-400 text-sm my-2">
            {new Date(msg.createdAt).toLocaleDateString([], {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        )}
        <MessageTile
          message={msg}
          currentUser={currentUser}
          activeContact={activeContact}
        />
      </React.Fragment>
    );
  });

  return (
    <>
      <Nav />
      <div className="flex h-[calc(100dvh-var(--nav-height))] mt-20 lg:mt-0 pt-0">
        <Sidebar
          contacts={contacts}
          activeContact={activeContact}
          onSelect={setActiveContact}
          currentUser={currentUser}
        />

        <div className="flex-1 flex flex-col">
          {activeContact && (
            <>
              <div className="flex-1 w-full overflow-y-auto mb-5 flex flex-col gap-3 px-5 max-w-200 mx-auto">
                {messagesList}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex p-5 pt-0 max-w-200 mx-auto w-full">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-5 py-4 bg-blue-200 rounded-l-xl tracking-wide"
                  placeholder="Napisz wiadomość..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-200 text-white px-4 rounded-r-xl cursor-pointer"
                >
                  <img src="send.svg" alt="ikona samolotu" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
