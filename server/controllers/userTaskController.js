import { UserTask } from "../models/UserTask.js";
import { User } from "../models/User.js";
import { Block } from "../models/Block.js";

async function getAllUserTasks(req, res) {
  try {
    const { time, child, difficulty, page = 1, limit = 10, sortBy = 'createdAt', order = -1 } = req.query;
    const populateOptions = [
      { path: 'task', select: 'difficulty category correctIndex questionType' }, 
      { path: 'child', select: 'name' }
    ];
    const sortOption = { [sortBy]: Number(order) };
    let query = {};

    if (time && time !== "all") {
      const queryTime = new Date();
      if (time === 'week') queryTime.setDate(queryTime.getDate() - 7);
      if (time === 'month') queryTime.setDate(queryTime.getDate() - 30);
      if (time === 'year') queryTime.setDate(queryTime.getDate() - 365);
      query.createdAt = { $gte: queryTime };
    }

    if (child) {
      const childArray = Array.isArray(child) ? child : [child];
      query.child = { $in: childArray };
    }

    let userTasks = await UserTask.find(query)
      .populate(populateOptions)
      .sort(sortOption);

    let filtered = userTasks;
    if (difficulty) {
      const diffArray = Array.isArray(difficulty) ? difficulty : [difficulty];
      filtered = userTasks.filter(ut => 
        ut.task && diffArray.includes(ut.task.difficulty)
      );
    }

    const childIds = [...new Set(filtered.map(t => t.child._id.toString()))];
    const parents = await User.find({ child: { $in: childIds } })
      .select('_id firstName lastName child');

    const childToParent = {};
    parents.forEach(p => {
      p.child.forEach(cId => {
        childToParent[cId.toString()] = {
          parentId: p._id,
          parentName: `${p.firstName} ${p.lastName}`
        };
      });
    });

    let results = filtered.map(t => ({
      ...t.toObject(),
      parent: childToParent[t.child._id.toString()] || null
    }));

    const total = results.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedResults = results.slice(startIndex, startIndex + Number(limit));

    res.json({ 
      total, 
      page: Number(page), 
      limit: Number(limit), 
      filtered: paginatedResults 
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Błąd przy pobieraniu statystyk" });
  }
}

export const getUserTask = async (req, res) => {
  const { taskId, blockId, childId } = req.query;
  const lastAttempt = await UserTask.findOne({
    task: taskId,
    block: blockId,
    child: childId
  }).sort({ createdAt: -1 });

  res.json(lastAttempt);
};

export const getUserTaskbyId = async (req, res) => {
  const { id } = req.params;
  const usertask = await UserTask.findById(id)

  res.json(usertask);
};

async function getCompleted(req, res) {
  try {
    const { blockId } = req.params;
    const { childId } = req.query;

    if (!childId) {
      return res.status(400).json({ error: "childId required" });
    }

    const block = await Block.findById(blockId).lean();
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    const taskIds = block.tasks.map(id => id.toString());
    const totalTasks = taskIds.length;
    const userTasks = await UserTask.find({
      child: childId,
      block: blockId,
      task: { $in: taskIds }
    }).lean();

    const attemptedTaskIds = new Set(
      userTasks.map(ut => ut.task.toString())
    );

    const correctTaskIds = new Set(
      userTasks
        .filter(ut => ut.correct === true)
        .map(ut => ut.task.toString())
    );

    let status;

    if (correctTaskIds.size === totalTasks) {
      status = "COMPLETED_ALL_CORRECT";
    } else if (attemptedTaskIds.size === totalTasks) {
      status = "ATTEMPTED_ALL_NOT_ALL_CORRECT";
    } else {
      status = "INCOMPLETE";
    }

    res.json({
      blockId,
      status,
      stats: {
        totalTasks,
        attempted: attemptedTaskIds.size,
        correct: correctTaskIds.size
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getTasksToReview(req, res) {
  try {
    const { blockId } = req.params;
    const { childId } = req.query;

    if (!childId) {
      return res.status(400).json({ error: "childId required" });
    }

    const tasks = await UserTask.aggregate([
      {
        $match: {
          child: new mongoose.Types.ObjectId(childId),
          block: new mongoose.Types.ObjectId(blockId)
        }
      },
      { $sort: { task: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$task",
          lastAttempt: { $first: "$$ROOT" }
        }
      },
      {
        $match: {
          "lastAttempt.correct": false
        }
      }
    ]);

    res.json({
      blockId,
      reviewTasks: tasks.map(t => t._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export const createUserTask = async (req, res) => {
  const newTask = await UserTask.create(req.body);
  res.json(newTask);
};

async function updateUserTask(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;


    const updatedUserTask = await UserTask.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUserTask) {
      return res.status(404).json({ message: "Statystyka nie znaleziona" });
    }

    res.json(updatedUserTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy aktualizacji statystyki" });
  }
}

async function deleteUserTask(req, res) {
  try {
    const { id } = req.params;
    const deletedUserTask = await UserTask.findByIdAndDelete(id);

    if (!deletedUserTask) {
      return res.status(404).json({ message: "Statystyka nie znaleziona" });
    }

    res.json({ message: "Statystyka została usunięta", userTask: deletedUserTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy usuwaniu statystyki" });
  }
}

export default { getAllUserTasks, getUserTask, createUserTask, updateUserTask, deleteUserTask, getCompleted, getTasksToReview, getUserTaskbyId }