import express from 'express'
import multer from "multer";
import { upload } from "../middleware/upload.js";
import taskController from "../controllers/taskController.js"
import { authenticateJWT } from "../middleware/authMiddleware.js"
import { role } from "../middleware/role.js";

const upload1 = multer();

const taskRouter = express.Router()

taskRouter.get('/', authenticateJWT, taskController.getAllTasks)

taskRouter.get('/categories', authenticateJWT, taskController.getAllCategories)

taskRouter.get('/questionTypes', authenticateJWT, taskController.getAllTasksTypes)

taskRouter.get('/ageCategories', authenticateJWT, taskController.getAgeCategories)

taskRouter.get('/authors', authenticateJWT, taskController.getTaskAuthors)

taskRouter.get('/:id', authenticateJWT, taskController.getTask)

taskRouter.post('/', upload.single("image"), authenticateJWT, role("therapist"), taskController.createTask)

taskRouter.post('/predictEmotion', upload1.single("image"), authenticateJWT, taskController.getPrediction)

taskRouter.put('/:id', upload.single("image"), authenticateJWT, role("therapist"), taskController.updateTask)

taskRouter.delete('/:id', authenticateJWT, role("therapist"), taskController.deleteTask)

export default taskRouter