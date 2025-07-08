import React, { useState } from "react";

function Filter({ handleFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];
      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Filter Courses
      </h3>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Categories
        </p>
        {[
          "Full Stack Web Development",
          "Frontend Development",
          "Backend Development",
          "DevOps Training",
          "Machine Learning",
          "Node.js",
          "Digital Marketing",
          "Data Science",
        ].map((category) => (
          <label
            key={category}
            className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-300"
          >
            <input
              type="checkbox"
              className="mr-2"
              value={category}
              onChange={() => handleCategoryChange(category)}
              checked={selectedCategories.includes(category)}
            />
            {category}
          </label>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort by Price
        </p>
        <select
          value={sortByPrice}
          onChange={(e) => selectByPriceHandler(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
