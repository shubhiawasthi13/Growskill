import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseTab from "./courseTab";

function EditCourse() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 transition-colors">
      <h1 className="text-xl font-bold mb-6">Edit Course</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-100">
        Add detailed information regarding your course such as description,
        price, and additional content.
      </p>

      <Button asChild>
        <Link to="lectures">Go to Lecture Page</Link>
      </Button>
      <CourseTab />
    </div>
  );
}

export default EditCourse;
