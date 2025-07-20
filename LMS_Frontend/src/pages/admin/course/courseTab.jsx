import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useDeleteCourseMutation,
} from "@/features/api/courseApi";
import { toast } from "sonner";

function CourseTab() {
  const navigate = useNavigate();

  const params = useParams();
  const courseId = params.courseId;

  const [EditCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const { data: courseByIdData, isLoading: courseByIdLoading } =
    useGetCourseByIdQuery(courseId);

  const [publishCourse, {}] = usePublishCourseMutation();

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("failed to update status");
    }
  };

  const [deleteCourse, { isLoading: deleteLoading }] =
    useDeleteCourseMutation();
  const deleteCourseHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await deleteCourse(courseId);
      if (res.data?.success) {
        toast.success(res.data.message || "Course deleted successfully");
        navigate("/admin/course");
      } else {
        toast.error(res.error?.data?.message || "Failed to delete course");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  useEffect(() => {
    if (courseByIdData?.course) {
      console.log("Fetched course data:", courseByIdData);
      const c = courseByIdData.course;
      setInput({
        courseTitle: c.courseTitle || "",
        subTitle: c.subTitle || "",
        description: c.description || "",
        category: c.category || "",
        courseLevel: c.courseLevel || "",
        coursePrice: c.coursePrice || "",
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    console.log(input);
  };
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });

      const fileReader = new FileReader(); // ✅ Correct casing
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();

    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);

    formData.append("courseThumbnail", input.courseThumbnail);

    await EditCourse({ formData, courseId });
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course Edited");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) return <div>Loading...</div>;

  return (
    <div className="mt-5 px-4">
      <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Basic Course Info</CardTitle>
            <CardDescription>Make changes to your course here.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 ">
            <Button
              disabled={courseByIdData.course.lectures.length == 0}
              className={`${
                courseByIdData.course.isPublished
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={() =>
                publishStatusHandler(
                  courseByIdData.course.isPublished ? "false" : "true"
                )
              }
            >
              {courseByIdData.course.isPublished ? "Unpublish" : "Publish"}
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={deleteCourseHandler}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Remove Course"
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input
                type="text"
                name="courseTitle"
                value={input.courseTitle}
                onChange={changeEventHandler}
                placeholder="Full Stack Dev"
              />
            </div>

            <div className="space-y-2">
              <Label>Sub Title</Label>
              <Input
                type="text"
                name="subTitle"
                value={input.subTitle}
                onChange={changeEventHandler}
                placeholder="Learn basic to advance"
              />
            </div>
          </div>

          <div className="space-y-2">
            <RichTextEditor
              key={input.description ? "editor-loaded" : "editor-empty"}
              value={input.description}
              onChange={(val) =>
                setInput((prev) => ({ ...prev, description: val }))
              }
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={input.category}
                onValueChange={(val) => setInput({ ...input, category: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Stack Web Development">
                    Full Stack Web Development
                  </SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Backend Development">
                    Backend Development
                  </SelectItem>
                  <SelectItem value="DevOps Training">
                    DevOps Training
                  </SelectItem>
                  <SelectItem value="Machine Learning">
                    Machine Learning
                  </SelectItem>
                  <SelectItem value="Node.js">Node.js</SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={(val) =>
                  setInput({ ...input, courseLevel: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Advance">Advance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price in (US)</Label>
              <Input
                type="text"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="$299"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Course Thumbnail</Label>
            {previewThumbnail && (
              <div className="mt-3">
                <Label className="mb-1 block">Preview</Label>
                <img
                  src={previewThumbnail}
                  alt="Course thumbnail preview"
                  className="w-48 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-700 shadow"
                />
              </div>
            )}
            <Input type="file" accept="image/*" onChange={selectThumbnail} />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait..
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseTab;
