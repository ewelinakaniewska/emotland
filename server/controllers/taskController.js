import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import multer from "multer";
import { predict } from "../services/emotionRecognitionService.js";

async function getAllTasks(req, res) {
  try {
    const { category, search, questionType, ageCategory, difficulty, author, page = 1, limit = 10, sortBy = 'category', order = 1 } = req.query;

    const sortOption = { [sortBy]: Number(order) };
    let query = {};

    const handleMultiSelect = (val) => {
      if (!val) return null;
      return { $in: Array.isArray(val) ? val : [val] };
    };

    if (category) query.category = category; 
    if (author) query.author = author;    
    if (questionType) query.questionType = handleMultiSelect(questionType);
    if (ageCategory) query.ageCategory = handleMultiSelect(ageCategory);
    if (difficulty) query.difficulty = handleMultiSelect(difficulty);

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ text: regex }];
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate("author", "firstName lastName _id")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const formattedTasks = tasks.map(t => {
      const taskObj = t.toObject();
      if (taskObj.author) {
        taskObj.authorName = `${taskObj.author.firstName} ${taskObj.author.lastName}`;
      }
      return taskObj;
    });

    res.json({ total, page: Number(page), limit: Number(limit), tasks: formattedTasks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd przy pobieraniu zadań" });
  }
}

async function getTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Nie znaleziono zadania" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Błąd przy pobieraniu zadania" });
  }
}

export async function createTask(req, res) {
  try {
    const {
      text,
      questionType,
      options,
      correctIndex,
      category,
      ageCategory,
      difficulty,
      hint,
      explanation,
      author
    } = req.body;

    const parsedOptions =
      questionType === "single_choice" && options
        ? JSON.parse(options)
        : [];

    const img =
      questionType === "single_choice" && req.file
        ? `/images/${req.file.filename}`
        : null;

    const task = await Task.create({
      text,
      questionType,
      options: parsedOptions,
      correctIndex: questionType === "single_choice" ? Number(correctIndex) : null,
      category,
      ageCategory,
      difficulty,
      hint,
      explanation,
      img,
      author
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd tworzenia zadania" });
  }
}
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const {
      text,
      questionType,
      options,
      correctIndex,
      category,
      ageCategory,
      difficulty,
      hint,
      explanation
    } = req.body;

    const parsedOptions =
      questionType === "single_choice" && options ? JSON.parse(options) : [];

    const img =
      questionType === "single_choice" && req.file
        ? `/images/${req.file.filename}`
        : undefined;

    const updateData = {
      text,
      questionType,
      options: parsedOptions,
      correctIndex:
        questionType === "single_choice" ? Number(correctIndex) : null,
      category,
      ageCategory,
      difficulty,
      hint,
      explanation,
    };

    if (img !== undefined) updateData.img = img;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Zadanie nie znalezione" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy aktualizacji zadania" });
  }
}

async function getPrediction(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Brak przesłanego pliku" });
    }
    const prediction = await predict(file);
    
    return res.json(prediction);

  } catch (err) {

    const statusCode = err.status || 500;
    
    return res.status(statusCode).json({ error: err.message });
  }
}
async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Zadanie nie znalezione" });
    }

    res.json({ message: "Zadanie zostało usunięte", task: deletedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy usuwaniu zadania" });
  }
}

async function getAllTasksTypes(req, res) {
  const typeList = await Task.distinct("questionType")
  return res.json(typeList)
}

async function getAllCategories(req, res) {
  const typeCat = await Task.distinct("category")
  res.json(typeCat)
}

async function getAgeCategories(req, res) {
  const typeCat = await Task.distinct("ageCategory")
  res.json(typeCat)
}

async function getTaskAuthors(req, res) {
  const auth = await Task.distinct("author")
  const authors = await User.find({ _id: { $in: auth } }).select('_id firstName lastName');

  const authorsWithName = authors.map(author => ({
    _id: author._id,
    name: `${author.firstName} ${author.lastName}`
  }));
  res.json(authorsWithName)
}
export default { getAllTasks, getTask, createTask, updateTask, deleteTask, getPrediction, getAllTasksTypes, getAllCategories, getAgeCategories, getTaskAuthors }