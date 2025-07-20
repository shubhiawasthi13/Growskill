import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

function AddCourse() {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
   const [createCourse, {data, error, isLoading ,isSuccess}]= useCreateCourseMutation();

  const createCourseHandler = async (e) => {
    e.preventDefault();
   await createCourse({courseTitle, category});

  };

  useEffect(() => {
if(isSuccess){
  toast.success(data?.message || "course created")
  navigate("/admin/course");
}
if(error){
const errorMessage = error?.data?.message || "Error in course creation";
    toast.error(errorMessage);
}
  },[isSuccess, error])
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>

      <form
        onSubmit={createCourseHandler}
        className="max-w-xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course title"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Full Stack Web Development">Full Stack Web Development</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="DevOps Training">DevOps Training</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Node.js">Node.js</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Data Science">Data Science</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button type="button" onClick={() => navigate("/admin/course")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Please wait...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
