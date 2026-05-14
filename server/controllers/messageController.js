import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

async function sendMessage(req, res) {
  try {
    const { from, to, content } = req.body;

    if (!from || !to || !content) {
      return res.status(400).json({ error: "Brak wymaganych pól." });
    }

    const sender = await User.findById(from);
    const receiver = await User.findById(to);
    if (!sender || !receiver) {
      return res.status(404).json({ error: "Użytkownik nie istnieje." });
    }

    const newMessage = await Message.create({ from, to, content });

    if (global.io) {
      global.io.to(to).emit("receiveMessage", newMessage);
      global.io.to(from).emit("receiveMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

async function getConversation(req, res) {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("from to", "username email");

    res.json(messages);
  } catch (err) {
    console.error("Błąd przy pobieraniu rozmowy:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }
}

async function markAsRead(req, res) {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Nie znaleziono wiadomości." });
    }

    res.json(message);
  } catch (err) {
    console.error("Błąd przy oznaczaniu wiadomości:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }
}

export default { markAsRead, getConversation, sendMessage }
