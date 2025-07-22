import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };
  return (
    <section className="w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white py-16 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center gap-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Unlock Your{" "}
          <span className="text-blue-700 dark:text-blue-400">Skills</span> with{" "}
          <br />
          <span className="text-blue-700 dark:text-blue-400">GrowSkill</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
          Start learning new technologies, develop practical knowledge, and grow
          your career with expert-curated content.
        </p>

        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
          Complete any course and earn a shareable{" "}
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            Certificate of Completion
          </span>{" "}
          to highlight your achievement and boost your resume.
        </p>

        <div className="w-full max-w-md">
          <form className="flex gap-2 p-4" onSubmit={searchHandler}>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search for a course..."
              className="border rounded px-4 py-2 w-full"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        <Button
          size="lg"
          className="text-base flex items-center gap-2 mt-4 sm:mt-6"
          onClick={() => navigate(`/course/search?query`)}
        >
          Explore Courses
        </Button>
      </div>
    </section>
  );
}
