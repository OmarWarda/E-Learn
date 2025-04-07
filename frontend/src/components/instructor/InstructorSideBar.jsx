import React from "react";

function InstructorSidebar({ setSelectedSection, selectedSection }) {
  return (
    <div className="w-64 min-h-screen bg-gray-100 text-gray-800 shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Instructor Dashboard</h2>
      <ul className="space-y-2">
        {[
          { label: "My Courses", key: "myCourses" },
          { label: "View Course Details", key: "courseDetails" },
          { label: "Create a New Course", key: "createCourse" },

          { label: "Edit Profile", key: "editProfile" }, // New Section
          { label: "Change Password", key: "changePassword" }, // New Section
          { label: "View Ratings & Reviews", key: "viewReviews" }, // New Section
        ].map((item) => (
          <li
            key={item.key}
            onClick={() => setSelectedSection(item.key)}
            className={`cursor-pointer px-4 py-2 rounded-lg transition ${
              selectedSection === item.key
                ? "bg-gray-300 text-gray-900 font-semibold"
                : "hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InstructorSidebar;
