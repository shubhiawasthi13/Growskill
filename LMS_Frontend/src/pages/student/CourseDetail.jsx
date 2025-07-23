import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Lock } from "lucide-react";
import ReactPlayer from "react-player";
import BuyCourseButton from "@/components/ui/BuyCourseButton";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading.......</h1>;
  if (isError) return <h1>Failed to load course details</h1>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  const allLecturesFree =
    course.lectures?.length > 0 &&
    course.lectures.every((lecture) => lecture.isPreviewFree === true);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-8 shadow-md">
          <CardContent className="p-0">
            <h1 className="text-3xl font-bold mb-2">{course.courseTitle}</h1>
            <p className="text-sm mb-1">
              Created By{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {course.creator.name}
              </span>
            </p>
            <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
              Last updated: {new Date(course.updatedAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Students enrolled: {course.enrolledStudents.length}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              {course.description}
            </p>

            <Card className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4">Course Content</h3>
                <ul className="space-y-3">
                  {course?.lectures?.map((lecture, idx) => (
                    <li key={lecture._id} className="flex items-center gap-2">
                      {purchased || allLecturesFree ? (
                        <PlayCircle size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                      <p>{lecture.lectureTitle}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <CardContent className="p-0">
              <div className="aspect-video mb-4 rounded-md overflow-hidden">
                <ReactPlayer
                  url={course.lectures[0].videoUrl.replace('http://', 'https://')}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
              <p className="text-lg font-semibold mb-4">
                {allLecturesFree ? (
                  <>
                    <p>Free</p>
                  </>
                ) : (
                  <>${course.coursePrice}</>
                )}
              </p>

              {purchased || allLecturesFree ? (
                <Button
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleContinueCourse}
                >
                  Continue
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
