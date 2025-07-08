import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Filter from "./Filter";

const useQuery = () => new URLSearchParams(useLocation().search);

const levelColorMap = {
  Beginner: "bg-green-500",
  Medium: "bg-yellow-500",
  Advanced: "bg-red-500",
};

const SearchPage = () => {
  const query = useQuery().get("query")?.toLowerCase() || "";
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  const handleCourseClick = (id) => {
    navigate(`/course-detail/${id}`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64">
          <div className="sticky top-4">
            <Filter handleFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Course Grid */}
        <main className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white capitalize">
            Showing results for "{query}"
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                Loading...
              </p>
            ) : data?.courses?.length ? (
              data.courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  className="cursor-pointer relative bg-white dark:bg-gray-800 rounded shadow overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
                >
                  {/* Level Badge */}
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded ${
                      levelColorMap[course.courseLevel] || "bg-gray-500"
                    }`}
                  >
                    {course.courseLevel}
                  </div>

                  {/* Image */}
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-full h-40 object-cover"
                  />

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {course.courseTitle}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 italic">
                        {course.subTitle}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        ₹{course.coursePrice}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        By {course.creator?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No courses found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
