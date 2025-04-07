import React, { useState } from "react";
import Form from "./Form";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState("admin");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-2">
          {["admin", "instructor", "corporate"].map((section) => (
            <li
              key={section}
              className={`p-3 cursor-pointer rounded-md transition duration-300 ${
                selectedSection === section
                  ? "bg-white text-blue-900 font-semibold shadow-md"
                  : "hover:bg-blue-600"
              }`}
              onClick={() => setSelectedSection(section)}
            >
              {section === "admin"
                ? "Add Admin"
                : section === "instructor"
                ? "Add Instructor"
                : "Add Corporate Trainee"}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 flex justify-center items-center">
        {selectedSection === "admin" && <AdminForm selectedSection="admin" />}
        {selectedSection === "instructor" && (
          <InstructorForm selectedSection="instructor" />
        )}
        {selectedSection === "corporate" && (
          <CorporateForm selectedSection="corporate" />
        )}
      </div>
    </div>
  );
};

const AdminForm = ({ selectedSection }) => (
  <Form
    title="Add Administrator"
    buttonText="Add Admin"
    selectedSection={selectedSection}
  />
);

const InstructorForm = ({ selectedSection }) => (
  <Form
    title="Add Instructor"
    buttonText="Add Instructor"
    selectedSection={selectedSection}
  />
);

const CorporateForm = ({ selectedSection }) => (
  <Form
    title="Add Corporate Trainee"
    buttonText="Add Corporate"
    selectedSection={selectedSection}
  />
);

export default AdminPage;
