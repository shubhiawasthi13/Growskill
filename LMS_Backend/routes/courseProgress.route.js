import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCourseProgress, markedAsCompleted, markedAsInCompleted, updateLectureProgress } from "../controllers/courseProgress.controller.js";
const router = express.Router();

router.route("/:courseId").get(isAuthenticated,  getCourseProgress)
router.route("/:courseId/lectures/:lectureId/view").post(isAuthenticated,  updateLectureProgress)
router.route("/:courseId/complete").post(isAuthenticated,  markedAsCompleted)
router.route("/:courseId/incomplete").post(isAuthenticated,  markedAsInCompleted)

export default router;