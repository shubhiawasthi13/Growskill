import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function CourseTable() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCreatorCourseQuery();

  if (isLoading) return;
  <h1>Loading...</h1>;
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      <Button onClick={() => navigate("create")} className="mb-3">
        Create a new course
      </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left text-sm uppercase text-gray-700 dark:text-gray-300">
              <th className="px-6 py-3">Course Title</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data?.courses?.map((course) => (
              <tr
                key={course._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">{course.courseTitle}</td>
                <td className="px-6 py-4">${course?.coursePrice || "NA"}</td>
                <td className="px-6 py-4">
                  <Badge
                    className={`${
                      course.isPublished
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-6 py-4" onClick= {() =>navigate(`${course._id}`)}>
                  <button>
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-center mt-5">List of your recent courses</p>
      </div>
    </div>
  );
}

export default CourseTable;
