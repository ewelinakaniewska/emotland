import express from 'express'
import messageController from "../controllers/messageController.js"
import { authenticateJWT } from "../middleware/authMiddleware.js"

const messageRouter = express.Router()

messageRouter.post('/', authenticateJWT, messageController.sendMessage);

messageRouter.get('/conversation/:user1/:user2', authenticateJWT, messageController.getConversation);

messageRouter.patch('/:messageId/read', authenticateJWT, messageController.markAsRead);

export default messageRouter