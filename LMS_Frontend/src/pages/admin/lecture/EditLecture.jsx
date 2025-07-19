import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const MEDIA_API = "https://groww-skill.netlify.app//api/v1/media";

function EditLecture() {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();

  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureVideo, setLectureVideo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data.success) {
          setLectureVideo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const {data:lectureData} = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;
  useEffect(() => {
if(lecture){
  setLectureTitle(lecture.lectureTitle)
setIsFree(!!lecture.isPreviewFree)

  setLectureVideo(lecture.videoInfo)
}
  },[lecture])

  const [editLecture, { data, isLoading, isSuccess, error }] = useEditLectureMutation();

  const editLectureHandler = async (e) => {
    e.preventDefault();
    await editLecture({
      lectureTitle,
      videoInfo: lectureVideo || {},
      courseId,
      lectureId,
      isPreviewFree: isFree
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      navigate(-1);
    }
    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isSuccess, error, data]);

  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] =
    useRemoveLectureMutation();

  const handleRemoveLecture = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
      navigate(-1);
    }
  }, [removeSuccess]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 transition-colors">
      <h1 className="text-2xl font-bold">Edit Lecture</h1>

      <Button
        variant="destructive"
        className="mb-3 mt-2"
        onClick={handleRemoveLecture}
      >
        Remove Lecture
      </Button>

      <form
        className="max-w-xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
        onSubmit={editLectureHandler}
      >
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Lecture Title
          </label>
          <input
            type="text"
            id="title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter new lecture title"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="video" className="block mb-2 text-sm font-medium">
            Upload New Video (optional)
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={fileChangeHandler}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-white hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
        </div>

        <div className="flex items-center gap-4">
          <Switch
            id="airplane-mode"
            checked={isFree}
       onCheckedChange={(checked) => setIsFree(checked)}

          />
          <Label htmlFor="airplane-mode" className="text-sm font-medium">
            Is this video free?
          </Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" onClick={() => navigate(-1)} variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            Update Lecture
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditLecture;
