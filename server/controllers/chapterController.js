import { Chapter } from "../models/Chapter.js"
import { Block } from "../models/Block.js"
import { Task } from "../models/Task.js"
import { UserTask } from "../models/UserTask.js";
import path from "path";
import fs from "fs"

async function getChapter(req, res) {
  try {
    const { chapterId } = req.params;
    const ageCategory = req.query.ageCategory;

    const chapter = await Chapter.findById(chapterId)
      .populate({
        path: "blocks",
        options: { sort: { order: 1 } },
        populate: {
          path: "tasks",
          match: ageCategory ? { ageCategory } : {},
          options: { sort: { order: 1 } },
        },
      });

    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    res.json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

async function updateFullChapter(req, res) {
  try {
    const { chapterId } = req.params;
    const { title, ageCategory, difficulty, assignedChildren, blocks } = req.body;


    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: "Rozdział nie znaleziony" });

    if (chapter.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    chapter.title = title || chapter.title;
    chapter.ageCategory = ageCategory || chapter.ageCategory;
    chapter.difficulty = difficulty || chapter.difficulty;

    if (req.file) {
      if (chapter.img) {
        const oldPath = path.join("public", chapter.img);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      chapter.img = `/images/${req.file.filename}`;
    }

    if (assignedChildren) {
      const parsedChildren = JSON.parse(assignedChildren);
      chapter.assignedChildren = parsedChildren;
    }

    if (blocks) {
      const parsedBlocks = JSON.parse(blocks);

      parsedBlocks.forEach(b => {
        if (b.tasks.length < 2 || b.tasks.length > 5) {
          throw new Error("Każdy blok musi mieć 2–5 zadań");
        }
      });
      await Block.deleteMany({ chapter: chapter._id });

      const blockDocs = await Promise.all(
        parsedBlocks.map((block, index) =>
          Block.create({
            title: block.title,
            chapter: chapter._id,
            tasks: block.tasks,
            xPercent: block.xPercent,
            yPercent: block.yPercent,
            order: index
          })
        )
      );

      chapter.blocks = blockDocs.map(b => b._id);
    }

    await chapter.save();
    res.json(chapter);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Błąd serwera" });
  }

}

async function getAllChapters(req, res) {
  try {
    const { assignedChildren } = req.query
    const chapters = await Chapter.find({ assignedChildren }, "_id title order difficulty img")
      .sort({ order: 1 });

    res.json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

async function getTherapistsChapters(req, res) {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Brak dostępu do danych tego użytkownika" });
    }

    const chapters = await Chapter.find({ createdBy: userId })
      .populate("blocks")
      .sort({ createdAt: -1 });

    res.json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
}

async function getChapterReviewTasks(req, res) {
  try {
    const { id: chapterId } = req.params;
    const { childId } = req.query;

    if (!childId) return res.status(400).json({ error: "childId required" });

    const chapter = await Chapter.findById(chapterId).lean();
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    const blocks = await Block.find({ _id: { $in: chapter.blocks } }).lean();
    const blockIds = blocks.map(b => b._id.toString());

    const userTasks = await UserTask.find({
      child: childId,
      block: { $in: blockIds }, 
    })
      .sort({ createdAt: -1 })
      .lean();

    const lastAttemptMap = {};
    userTasks.forEach(ut => {
      const taskId = ut.task.toString();
      if (!lastAttemptMap[taskId]) lastAttemptMap[taskId] = ut;
    });

    const reviewTaskIds = Object.values(lastAttemptMap)
      .filter(ut => ut.correct === false)
      .map(ut => ut.task.toString());

    const reviewTasks = await Task.find({ _id: { $in: reviewTaskIds } }).lean();

    const taskToBlockMap = {};
    blocks.forEach(block => {
      block.tasks.forEach(taskId => {
        taskToBlockMap[taskId.toString()] = block._id.toString();
      });
    });

    const reviewTasksWithBlock = reviewTasks.map(task => ({
      ...task,
      blockId: taskToBlockMap[task._id.toString()],
    }));

    res.json({ chapterId, tasks: reviewTasksWithBlock });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function createFullChapter(req, res) {
  try {

    const {
      title,
      ageCategory,
      difficulty,
      assignedChildren,
      blocks
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Chapter image is required" });
    }

    const parsedBlocks = JSON.parse(blocks);
    const parsedChildren = JSON.parse(assignedChildren);

    if (!parsedBlocks.length) {
      return res.status(400).json({ message: "At least one block required" });
    }

    parsedBlocks.forEach(b => {
      if (b.tasks.length < 2 || b.tasks.length > 5) {
        throw new Error("Each block must have 2–5 tasks");
      }
    });

    const chapter = await Chapter.create({
      title,
      img: `/images/${req.file.filename}`,
      ageCategory,
      difficulty,
      assignedChildren: parsedChildren,
      createdBy: req.user._id,
    });

    const blockDocs = await Promise.all(
      parsedBlocks.map((block, index) =>
        Block.create({
          title: block.title,
          chapter: chapter._id,
          tasks: block.tasks,
          xPercent: block.xPercent,
          yPercent: block.yPercent,
          order: index
        })
      )
    );

    chapter.blocks = blockDocs.map(b => b._id);
    await chapter.save();

    res.status(201).json(chapter);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
}

async function getProgressForChild(req, res) {
  try {
    const { childId } = req.params;

    const chapters = await Chapter.find().populate("blocks");


    
    const userTasks = await UserTask.find({
      child: childId,
      correct: true
    }).select("block task");

    const completedMap = {};
    userTasks.forEach(ut => {
      const bId = ut.block.toString();
      if (!completedMap[bId]) completedMap[bId] = new Set();
      completedMap[bId].add(ut.task.toString());
    });

    const results = chapters.map(chapter => {
      let completedBlocksCount = 0;

      chapter.blocks.forEach(block => {
        const tasksInBlock = block.tasks || [];
        const blockIdStr = block._id.toString();
        
        const doneTasksInThisBlock = completedMap[blockIdStr] || new Set();

        const isComplete = tasksInBlock.length > 0 && 
                           tasksInBlock.every(tId => doneTasksInThisBlock.has(tId.toString()));

        if (isComplete) {
          completedBlocksCount++;
        }
      });

      return {
        chapterId: chapter._id,
        title: chapter.title,
        completedBlocks: completedBlocksCount,
        totalBlocks: chapter.blocks.length,
        progressLabel: `${completedBlocksCount}/${chapter.blocks.length}`
      };
    });

    res.json({ chapterProgress: results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createChapter(req, res) {
  try {
    const { title, order, blocks, difficulty } = req.body;

    const chapter = new Chapter({
      title,
      order,
      blocks: blocks || [],
      difficulty,
    });

    await chapter.save();
    res.status(201).json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

async function updateChapter(req, res) {
  try {
    const { chapterId } = req.params;
    const { title, order, blocks, difficulty } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      {
        title,
        order,
        blocks,
        difficulty,
      },
      { new: true }
    );

    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    res.json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
async function deleteChapter(req, res) {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: "Rozdział nie znaleziony" });

    if (chapter.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Brak uprawnień do usunięcia tego rozdziału" });
    }

    const blocks = await Block.find({ chapter: chapterId });
    const blockIds = blocks.map(b => b._id);

    await UserTask.deleteMany({ block: { $in: blockIds } });

    await Block.deleteMany({ chapter: chapterId });

    if (chapter.img) {
      const fileName = chapter.img.replace("/images/", "");
      const fullPath = path.join(process.cwd(), "public", "images", fileName);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Chapter.findByIdAndDelete(chapterId);

    res.json({ message: "Rozdział i powiązane dane zostały usunięte." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas usuwania rozdziału" });
  }
}

export default { deleteChapter, updateChapter, getAllChapters, getChapter, getProgressForChild, createChapter, getChapterReviewTasks, createFullChapter, getTherapistsChapters, updateFullChapter }
