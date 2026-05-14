import { User } from "../models/User.js";
import mongoose from "mongoose";
import { Message } from "../models/Message.js"
import { UserTask } from "../models/UserTask.js"
import { Chapter } from "../models/Chapter.js";
import { Task } from "../models/Task.js";
import { Block } from "../models/Block.js";
import { Article } from "../models/Article.js"
import bcrypt from 'bcryptjs'

async function getAllUsers(req, res) {
  try {
    const { role, search, page = 1, limit = 12, sortBy = 'name', order = 1 } = req.query
    const sortOption = { [sortBy]: Number(order) };
    let query = {}

    if (role) {
      query = { role: role }
    }

    if (search) {
      const regex = new RegExp(search, "i")
      query = {
        ...query,
        $or: [
          { firstName: regex },
          { lastName: regex },
          { name: regex },
          { email: regex }
        ]
      }
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query).sort(sortOption).skip((page - 1) * limit).limit(Number(limit));

    res.json({ total, page: Number(page), limit: Number(limit), users })

  } catch (err) {
    res.status(500).json({ error: "Błąd przy pobieraniu użytkowników" })
  }
}

async function getTherapistParentsAndChildren(req, res) {
  try {
    const { therapistId } = req.params;
    const therapist = await User.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ message: "Terapeuta nie znaleziony" });
    }

    const parentIds = therapist.parent || [];
    const parents = await User.find({ _id: { $in: parentIds }, role: "parent" })
      .select("_id firstName lastName child")
      .populate("child", "_id name")
      .lean();

    const result = parents.map(parent => ({
      parentId: parent._id,
      parentName: `${parent.firstName} ${parent.lastName}`,
      child: parent.child || []
    }));

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera", error });
  }
}


async function getParentTherapist(req, res) {
  const { id } = req.params;
  const therapist = await User.findOne(
    {
      role: "therapist",
      parent: id
    },
    "firstName lastName email _id"
  );

  if (!therapist) {
    return res.json({
      hasTherapist: false,
      therapist: null
    });
  }

  res.json({
    hasTherapist: true,
    therapist
  });
}

async function createParentTherapistConnection(req, res) {
  const { userId } = req.body;
  const { code } = req.body

  const therapist = await User.findOne({ code: code })
  const parent = await User.findById(userId)

  if (!therapist || !parent) {
    return res.status(404).json({ message: "Użytkownik nie znaleziony" });
  }

  const existingTherapist = await User.findOne({
    role: "therapist",
    parent: parent._id
  });

  if (existingTherapist) {
    return res.status(400).json({ message: "Możesz utworzyć połączenie tylko z jednym terapeutą" })
  }

  await User.updateOne(
    { _id: therapist._id },
    { $addToSet: { parent: parent._id } }
  );

  res.json({ message: "Połączono rodzica z terapeutą!" });
}


async function deleteParentTherapistConnection(req, res) {
  const { userId } = req.body;
  const parent = await User.findById(userId)
  const existingTherapist = await User.findOne({
    role: "therapist",
    parent: parent._id
  });

  if (existingTherapist) {
    existingTherapist.parent = existingTherapist.parent.filter(userId => userId.toString() !== parent._id.toString());
  }

  await existingTherapist.save();

  res.json({ message: "Rozłączono rodzica z terapeutą!" });

}

async function getContacts(req, res) {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

  let contacts = [];
  if (user.role === "therapist") {
    const parentIds = user.parent.map(id => new mongoose.Types.ObjectId(id));
    contacts = await User.find({ _id: { $in: parentIds } });
  } else if (user.role === "parent") {
    contacts = await User.find({ role: "therapist", parent: new mongoose.Types.ObjectId(user._id) });
  }

  const contactsWithLastMessage = await Promise.all(
    contacts.map(async (contact) => {
      const lastMsg = await Message.findOne({
        $or: [
          { from: user._id, to: contact._id },
          { from: contact._id, to: user._id }
        ]
      })
        .sort({ createdAt: -1 })
        .lean();

      return {
        ...contact.toObject(),
        lastMessage: lastMsg || null
      };
    })
  );

  res.json(contactsWithLastMessage);
}

async function getChildren(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .populate(
        {
          path: "child",
          select: "name _id"
        }
      );;
    if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });
    res.json(user.child)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getTherapistCode(req, res) {
  const { user } = req.body
  const therapist = await User.findById(user)
  res.json({ code: therapist.code })
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Błąd przy pobieraniu użytkownika" });
  }
}

async function createUser(req, res) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Błąd przy tworzeniu użytkownika" });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (!updateData.password || updateData.password.trim() === "") {
      delete updateData.password;
    } else {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy aktualizacji użytkownika" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Nie masz uprawnień do usunięcia tego konta" });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

    if (userToDelete.role === 'child') {
      await UserTask.deleteMany({ child: id });
    }

    const childrenIds = userToDelete.child?.map(c => c._id) || [];

    if (childrenIds.length > 0) {
      await UserTask.deleteMany({ child: { $in: childrenIds } });
      await User.deleteMany({ _id: { $in: childrenIds } });
    }

    await User.updateMany(
      { role: 'therapist', parent: id },
      { $pull: { parent: id } }
    );

    if (userToDelete.role === 'therapist') {
      const therapistTaskIds = await Task.find({ author: id }).distinct("_id");

      if (therapistTaskIds.length > 0) {
        await UserTask.deleteMany({ task: { $in: therapistTaskIds } });
      }

      await Task.deleteMany({ author: id });
      await Article.deleteMany({ author: id });

      const therapistChapters = await Chapter.find({ createdBy: id }).distinct("_id");
      if (therapistChapters.length > 0) {
        await Block.deleteMany({ chapter: { $in: therapistChapters } });
        await Chapter.deleteMany({ _id: { $in: therapistChapters } });
      }

      await User.updateMany(
        { role: 'parent', therapist: id },
        { $set: { therapist: null } }
      );
    }

    await Message.deleteMany({
      $or: [
        { from: id },
        { to: id }
      ]
    });

    await User.findByIdAndDelete(id);

    res.json({ message: "Konto oraz wszystkie powiązane dane zostały usunięte." });
  } catch (err) {
    console.error("Błąd usuwania użytkownika:", err);
    res.status(500).json({ error: "Błąd podczas usuwania konta." });
  }
}
export default { getAllUsers, getUser, createUser, updateUser, deleteUser, getChildren, getContacts, createParentTherapistConnection, getParentTherapist, getTherapistParentsAndChildren, deleteParentTherapistConnection, getTherapistCode }