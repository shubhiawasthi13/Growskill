import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Edit } from "lucide-react";

import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { toast } from "sonner";

function CreateLecture() {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const [lectureTitle, setLectureTitle] = useState("");

  const [createLecture, { data, isLoading, error, isSuccess }] =
    useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureLoading,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async (e) => {
    e.preventDefault();
    await createLecture({ lectureTitle, courseId });
    refetch(); // refetch lecture list after adding
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      setLectureTitle("");
    }
    if (error) {
      toast.error(error.data.message || "error");
    }
  }, [isSuccess, error]);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <h1 className="text-2xl font-bold mb-6">Add Lecture</h1>

      <form
        onSubmit={createLectureHandler}
        className="max-w-xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter lecture title"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="button" onClick={() => navigate("/admin/course/")}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Please wait...
              </>
            ) : (
              "Add Lecture"
            )}
          </Button>
        </div>
      </form>

     <div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">
    Lectures
  </h2>

  {lectureLoading ? (
    <div className="flex items-center gap-2 text-blue-500">
      <Loader2 className="animate-spin" />
      Loading lectures...
    </div>
  ) : lectureData?.lectures?.length > 0 ? (
    <ul className="space-y-2">
      {
        // ✅ Filter duplicate lectures by _id
        Array.from(
          new Map(
            lectureData.lectures.map((lecture) => [lecture._id, lecture])
          ).values()
        ).map((lecture, index) => (
          <li
            key={`${lecture._id}-${index}`} // ✅ Safe unique key
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <span className="font-medium">Lecture-{index + 1}. </span>
              {lecture.lectureTitle}
            </div>
            <button
              onClick={() =>
                navigate(`/admin/course/${courseId}/lectures/${lecture._id}`)
              }
              className="text-blue-600 hover:text-blue-800"
              title="Edit Lecture"
            >
              <Edit size={20} />
            </button>
          </li>
        ))
      }
    </ul>
  ) : (
    <p className="text-gray-500">No lectures found.</p>
  )}
</div>

    </div>
  );
}

export default CreateLecture;
