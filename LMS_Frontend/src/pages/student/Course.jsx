import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

function Course({ course }) {
 const allLecturesFree =
  course.lectures?.length > 0 &&
  course.lectures.every((lecture) => lecture.isPreviewFree == true); 
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="w-[300px] mx-auto dark:bg-gray-900 dark:border-gray-800 relative">
        {/* Image container with badge */}
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="Course"
            className="rounded-t-md w-full object-cover h-30"
          />
          <Badge className="absolute top-2 left-2 bg-green-400 text-black text-xs hover:bg-green-500">
            {course.courseLevel}
          </Badge>
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground hover:underline">
            {course.description}
          </p>

          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={course.creator.photoUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <h1 className="text-sm font-medium">{course.creator.name}</h1>
          </div>

          {/* Price aligned right */}
          <div className="flex justify-end">
            <span className="text-md font-semibold text-green-700">
              {allLecturesFree ? (
                <>
                  <p>Free</p>
                </>
              ) : (
                <>${course.coursePrice}</>
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Course;
