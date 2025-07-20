import React from "react";


export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
   
      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} GrowSkill. All rights reserved.
      </div>
    </footer>
  );
}
