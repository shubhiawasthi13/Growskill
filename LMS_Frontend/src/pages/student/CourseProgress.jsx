import {
  useGetCourseProgressQuery,
  useMarkedAsCompletedMutation,
  useMarkedAsInCompletedMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function CourseProgress() {
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-4 md:w-[90%] m-auto ">
      {/* Top */}
      <div className="flex justify-between items-center mb-2">
        <div></div>
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

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow text-left">
            {`Lecture ${
              courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
            }: ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`}
          </div>
          <video
            src={currentLecture?.videoUrl || initialLecture.videoUrl}
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
    </div>
  );
}

export default CourseProgress;
