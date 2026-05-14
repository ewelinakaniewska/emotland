import express from 'express'
import articleController from "../controllers/articleController.js"
import { upload } from "../middleware/upload.js";
import { role } from "../middleware/role.js";
import { authenticateJWT } from "../middleware/authMiddleware.js"

const articleRouter = express.Router()

articleRouter.get('/', authenticateJWT, articleController.getAllArticles)

articleRouter.get('/categories', authenticateJWT, articleController.getCategories)

articleRouter.get('/authors', authenticateJWT, articleController.getAuthors)

articleRouter.get('/:id', authenticateJWT, articleController.getArticle)

articleRouter.post('/', authenticateJWT, role("therapist"), upload.single("image"), articleController.createArticle)

articleRouter.put('/:id', authenticateJWT, role("therapist"), upload.single("image"), articleController.updateArticle)

articleRouter.delete('/:id', authenticateJWT, role("therapist"), articleController.deleteArticle)

export default articleRouter