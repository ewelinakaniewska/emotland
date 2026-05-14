import express from 'express'
import chapterController from "../controllers/chapterController.js"
import { authenticateJWT } from "../middleware/authMiddleware.js"
import { upload } from "../middleware/upload.js";
import { role } from "../middleware/role.js";
const chapterRouter = express.Router()

chapterRouter.get("/", authenticateJWT, chapterController.getAllChapters);

chapterRouter.get("/:chapterId", authenticateJWT, chapterController.getChapter);

chapterRouter.get("/progress/:childId", authenticateJWT, chapterController.getProgressForChild)

chapterRouter.get("/:id/review", authenticateJWT, chapterController.getChapterReviewTasks)

chapterRouter.get("/user/:userId", authenticateJWT, chapterController.getTherapistsChapters)

chapterRouter.post("/full", authenticateJWT, role("therapist"), upload.single("image"), chapterController.createFullChapter);

chapterRouter.put("/:chapterId/full", authenticateJWT, role("therapist"), upload.single("image"), chapterController.updateFullChapter)

chapterRouter.patch("/:chapterId", authenticateJWT, role("therapist"), chapterController.updateChapter);

chapterRouter.delete("/:chapterId", authenticateJWT, role("therapist"), chapterController.deleteChapter);

export default chapterRouter
