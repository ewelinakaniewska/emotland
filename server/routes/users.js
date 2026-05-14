import express from 'express'
import userController from "../controllers/userController.js"
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { role } from "../middleware/role.js";

const userRouter = express.Router()

userRouter.get('/', authenticateJWT, userController.getAllUsers)

userRouter.get('/:id', authenticateJWT, userController.getUser)

userRouter.get('/children/:id', authenticateJWT, userController.getChildren)

userRouter.get('/contacts/:userId', authenticateJWT, userController.getContacts)

userRouter.get('/:id/therapist', authenticateJWT, userController.getParentTherapist)

userRouter.get('/therapist/:therapistId/children', authenticateJWT, userController.getTherapistParentsAndChildren)

userRouter.post('/disconnect', authenticateJWT, userController.deleteParentTherapistConnection)

userRouter.post('/connect', authenticateJWT, role("parent"), userController.createParentTherapistConnection)

userRouter.post('/therapistCode', authenticateJWT, role("therapist"), userController.getTherapistCode)

userRouter.post('/', authenticateJWT, userController.createUser)

userRouter.put('/:id', authenticateJWT, userController.updateUser)

userRouter.delete('/:id', authenticateJWT, userController.deleteUser)

export default userRouter