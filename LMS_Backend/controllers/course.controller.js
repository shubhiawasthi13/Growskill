import { Course } from "../modal/course.modal.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import { Lecture } from "../modal/lecture.modal.js";
import { CoursePurchase } from "../modal/coursePurchase.modal.js";
import { User } from "../modal/user.modal.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle && !category) {
      return res.status(400).json({
        success: false,
        message: "coursetitle and category required",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      course,
      success: true,
      message: "Course created successfully ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

export const getCreatorCourse = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "course not found",
      });
    }
    return res.status(201).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get courses",
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = "", sortByPrice = "" } = req.query;
    const categoryArray = categories ? categories.split(",") : [];

    // Build search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categoryArray.length > 0) {
      searchCriteria.category = { $in: categoryArray };
    }

    // Sorting logic
    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    else if (sortByPrice === "high") sortOptions.coursePrice = -1;

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      courses: courses || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Course not found",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    let courseThumbnail = course.courseThumbnail;

    if (thumbnail) {
      if (courseThumbnail) {
        const publicId = courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // Upload new thumbnail to cloudinary
      const uploaded = await uploadMedia(thumbnail.path);
      courseThumbnail = uploaded?.secure_url;
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail,
    };

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(201).json({
      success: true,
      updatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course by id",
    });
  }
};

// Lecture logic here.................
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture",
    });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(400).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;

    if (typeof isPreviewFree !== "undefined") {
      lecture.isPreviewFree = isPreviewFree;
    }

    await lecture.save();

    // check course still has the lecture id
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(400).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Delete lecture from cloudinary
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Delete lecture from course
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );
    return res.status(200).json({
      success: true,
      message: "Lecture remove successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(400).json({
        success: false,
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture by id",
    });
  }
};

// publish unpublish logic
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId); // ✅ Await here

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    // Toggle publish status
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished
      ? "Course published"
      : "Course unpublished";

    return res.status(200).json({
      success: true,
      message: statusMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish course",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 🔥 Delete all associated lectures and videos from Cloudinary
    for (const lecture of course.lectures) {
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
      await Lecture.findByIdAndDelete(lecture._id);
    }

    // 🔥 Delete course thumbnail from Cloudinary
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // 🔥 Delete course purchases
    await CoursePurchase.deleteMany({ courseId });

    // ✅ Remove course from users' enrollCourse array
    await User.updateMany(
      { enrollCourse: courseId },
      { $pull: { enrollCourse: courseId } }
    );

    // 🔥 Delete the course itself
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

export const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate({
        path: "creator",
        select: "name photoUrl",
      })
      .populate({
        path: "lectures", // ✅ this line populates lecture objects
        select: "isPreviewFree",
      });

    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No published courses found",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get Published Courses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published courses",
    });
  }
};
