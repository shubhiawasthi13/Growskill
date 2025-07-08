import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

function Courses() {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();
  console.log(data);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Our Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          : data?.courses &&
            data?.courses.map((course, index) => (
              <Course key={index} course={course} />
            ))}
      </div>
    </div>
  );
}

export default Courses;

export const CourseSkeleton = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Skeleton className="h-40 w-full mb-4 rounded-md" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};
