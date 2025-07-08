import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  deleteCourse,
  editCourse,
  getCourseById,
  getCourseLecture,
  getCreatorCourse,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
  updateLecture,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router = express.Router();
router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get(getPublishedCourse);
router.route("/").get(isAuthenticated, getCreatorCourse);
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lectures").post(isAuthenticated, createLecture);
router.route("/:courseId/lectures").get(isAuthenticated, getCourseLecture);
router
  .route("/:courseId/lectures/:lectureId")
  .post(isAuthenticated, updateLecture);
router.route("/lectures/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lectures/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);
router.route("/:courseId").delete(isAuthenticated, deleteCourse);

export default router;
