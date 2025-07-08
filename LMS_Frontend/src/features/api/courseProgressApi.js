import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "https://growskill-6gaq.onrender.com/api/v1/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => {
    return {
      getCourseProgress: builder.query({
        query: (courseId) => ({
          url: `/${courseId}`,
          method: "GET",
        }),
      }),
      updateLectureProgress: builder.mutation({
        query: ({ courseId, lectureId }) => ({
          url: `/${courseId}/lectures/${lectureId}/view`,
          method: "POST",
        }),
      }),
      markedAsCompleted: builder.mutation({
        query: (courseId) => ({
          url: `/${courseId}/complete`,
          method: "POST",
        }),
      }),
      markedAsInCompleted: builder.mutation({
        query: (courseId) => ({
          url: `/${courseId}/incomplete`,
          method: "POST",
        }),
      }),
    };
  },
});

// Export all hooks
export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useMarkedAsCompletedMutation,
  useMarkedAsInCompletedMutation,
} = courseProgressApi;
