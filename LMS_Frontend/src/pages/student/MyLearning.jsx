import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course"; // Reuse your existing course card
import { useLoadUserQuery } from "@/features/api/authApi";

function MyLearning() {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user.enrollCourses || [];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-3xl font-bold mb-6 ml-15 text-left text-gray-900 dark:text-white">
        My Learning
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 m-10">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <CourseSkeleton key={index} />
          ))
        ) : myLearning.length === 0 ? (
          <p>You are not enrolled in any courses</p>
        ) : (
          myLearning.map((course, index) => (
            <Course key={index} course={course} />
          ))
        )}
      </div>
    </div>
  );
}

export default MyLearning;

// Skeleton for MyLearning cards
export const CourseSkeleton = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md w-full space-y-4">
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};
