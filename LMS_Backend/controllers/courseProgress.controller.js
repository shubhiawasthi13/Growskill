import { CourseProgress } from "../modal/courseProgress.modal.js";
import { Course } from "../modal/course.modal.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    //step-1  fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");
    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(400).json({
        message: "Course not found",
      });
    }
    //step-2 if no progress found  return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }
    //step-3 return user course progress along with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    // create course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });
    if (!courseProgress) {
      // if no progress exist , create new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    // find the lecture progress in course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );
    if (lectureIndex !== -1) {
      // update status if lecture already exist
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // if all lecture is completed
    const lecturePrgressLength = courseProgress.lectureProgress.filter(
      (lectureprog) => lectureprog.viewed
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lecturePrgressLength) {
      courseProgress.completed = true;
    }
    await courseProgress.save();
    return res.status(200).json({
      message: "Lecture progree updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markedAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(400).json({
        message: "Course progress not found",
      });
    }
    courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = true);
    courseProgress.completed = true;
    await courseProgress.save();
      return res.status(200).json({
      message: "Course marked as compelted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markedAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(400).json({
        message: "Course progress not found",
      });
    }
    courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = false);
    courseProgress.completed = false;
    await courseProgress.save();
      return res.status(200).json({
      message: "Course marked as incompelted",
    });
  } catch (error) {
    console.log(error);
  }
};
