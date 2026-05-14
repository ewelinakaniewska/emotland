import React from "react";

export default function MessageTile({ message, currentUser, activeContact }) {
  const fromId = message.from._id ? message.from._id.toString() : message.from.toString();
  const isCurrentUser = fromId === currentUser;
  const date = new Date(message.createdAt);
  const sendAt = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} relative mt-1`}>
      <div className="h-5"></div>
      <span
        className={`absolute px-1 top-0 text-sm text-gray-600 ${isCurrentUser ? "right-0" : "left-0"
          }`}
      >
        {sendAt}
      </span>
      <div
        className={`
          ${isCurrentUser ? "bg-blue-200 rounded-br-none" : "bg-amber-200 rounded-bl-none"}
          w-fit max-w-3/4 p-4 rounded-4xl mt-1
    `}
      >
        {message.content}
      </div>
    </div>

  );
}