import express from 'express'
import userTaskController from "../controllers/userTaskController.js"
import { authenticateJWT } from '../middleware/authMiddleware.js';

const userTaskRouter = express.Router()

userTaskRouter.get('/', authenticateJWT, userTaskController.getAllUserTasks)

userTaskRouter.get('/:blockId/completed', authenticateJWT, userTaskController.getCompleted)

userTaskRouter.get('/userTask', authenticateJWT, userTaskController.getUserTask)

userTaskRouter.get('/:id', authenticateJWT, userTaskController.getUserTaskbyId)

userTaskRouter.get('/review/:blockId', authenticateJWT, userTaskController.getTasksToReview)

userTaskRouter.post('/', authenticateJWT, userTaskController.createUserTask)

userTaskRouter.put('/:id', authenticateJWT, userTaskController.updateUserTask)

userTaskRouter.delete('/:id', authenticateJWT, userTaskController.deleteUserTask)

export default userTaskRouter