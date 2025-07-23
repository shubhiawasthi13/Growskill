import {
  useGetCourseProgressQuery,
  useMarkedAsCompletedMutation,
  useMarkedAsInCompletedMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function CourseProgress() {
  const [questions, setQuestions] = useState([]);
  const [quesloading, setQuesLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [markedAsCompleted, { isSuccess: makeCompleteSuccess }] =
    useMarkedAsCompletedMutation();
  const [markedAsInCompleted, { isSuccess: makeInCompleteSuccess }] =
    useMarkedAsInCompletedMutation();

  useEffect(() => {
    if (makeCompleteSuccess) {
      refetch();
      toast.success("Course marked as completed!");
    }
  }, [makeCompleteSuccess]);

  useEffect(() => {
    if (makeInCompleteSuccess) {
      refetch();
      toast.success("Course marked as incomplete!");
    }
  }, [makeInCompleteSuccess]);
  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p className="text-center mt-10">Loading..........</p>;
  if (isError || !data)
    return <p className="text-center mt-10">Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, lectures } = courseDetails;

  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    markedAsCompleted(courseId);
  };
  const handleInCompleteCourse = async () => {
    markedAsInCompleted(courseId);
  };
  const generateQues = async (courseTitle) => {
    setModal(true);
    setQuesLoading(true);
    try {
      const res = await axios.post(
        "https://growskill-6gaq.onrender.com/api/v1/generate",
        { courseTitle },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // if you're using cookies or auth
        }
      );
      setQuestions(res.data.questions);
      setQuesLoading(false);
    } catch (err) {
      console.error(
        "Error generating questions:",
        err.response?.data || err.message
      );
    }
  };

  const generateCertificate = async (courseTitle) => {
    try {
      const response = await axios.post(
        "https://growskill-6gaq.onrender.com/api/v1/certificate",
        { courseName: courseTitle },
        {
          withCredentials: true, // ✅ Send cookies like JWT
          responseType: "blob", // ✅ Important for file downloads
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Create a blob from the PDF response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf"; // Set the desired file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Failed to download certificate:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-4 md:w-[90%] m-auto ">
      {/* Top */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={(e) => generateQues(courseTitle)}
          className={`px-4 py-1 rounded shadow flex items-center gap-2 bg-green-600 text-white dark:bg-green-500`}
        >
          Start Interview Prep
        </button>

        <button
          className={`px-4 py-1 rounded shadow flex items-center gap-2
    ${
      completed
        ? "bg-green-600 text-white dark:bg-green-500"
        : "bg-black dark:bg-white text-white dark:text-black"
    }
  `}
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
        >
          {completed ? (
            <>
              <CheckCircle2 size={20} />
              <span>Completed</span>
            </>
          ) : (
            "Mark as Completed"
          )}
        </button>
      </div>

      {/* Main */}
      <div className="flex flex-col md:flex-row gap-6 min-h-[500px]">
        {/* Left: Video + Title */}
        <div className="md:w-[60%] bg-white dark:bg-gray-800 rounded shadow p-4">
          <h2 className="text-2xl font-bold text-left mb-4">{courseTitle}</h2>
          {completed && (
            <button
              onClick={() => generateCertificate(courseTitle)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Download Certificate
            </button>
          )}

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow text-left">
            {`Lecture ${
              courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
            }: ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`}
          </div>
          <video
            src={
              currentLecture?.videoUrl.replace("http://", "https://") ||
              initialLecture.videoUrl.replace("http://", "https://")
            }
            className="w-full"
            controls
            onPlay={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
          />
        </div>

        {/* Right: Lecture List */}
        <div className="md:w-[40%] bg-white dark:bg-gray-800 rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Course Lecture</h3>
          <div className="space-y-4">
            {lectures.map((lecture, idx) => (
              <div
                key={lecture._id}
                onClick={() => handleSelectLecture(lecture)}
                className={`flex items-center justify-between p-4 border rounded-lg shadow cursor-pointer
          ${
            lecture._id === currentLecture?._id
              ? "bg-blue-100 dark:bg-blue-600 border-blue-500"
              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          }
        `}
              >
                <span className="font-medium">{lecture.lectureTitle}</span>
                <span className="flex items-center gap-2">
                  {isLectureCompleted(lecture._id) ? (
                    <CheckCircle2 size={25} className="text-green-600" />
                  ) : (
                    <CirclePlay size={25} className="text-blue-500" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AI modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="relative bg-white/80 dark:bg-gray-900/80 max-w-3xl w-full mx-4 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700">
            {/*  Close Button */}
            <button
              onClick={() => setModal(false)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              {courseTitle} Interview Questions
            </h2>

            {/* 🔄 Loader or Content */}
            {quesloading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
              </div>
            ) : (
              <ul className="space-y-3">
                {questions.map((q, i) => {
                  const [rawQ, ...rest] = q.split("Answer:");
                  const answer = rest.join("Answer:"); // in case "Answer:" is used inside the answer
                  return (
                    <li
                      key={i}
                      className="bg-gray-100/80 dark:bg-gray-800/80 shadow rounded-md p-4 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    >
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        Ques: {i + 1}. {rawQ.trim()}
                      </p>
                      {answer && (
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          Answer: {answer.trim()}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseProgress;
