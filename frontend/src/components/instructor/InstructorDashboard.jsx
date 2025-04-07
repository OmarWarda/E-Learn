import { useState } from "react";
import InstructorSidebar from "./InstructorSideBar";
import CourseList from "./CourseList";
import CreateCourse from "./CreateCourse";
import EditProfile from "./EditProfile";
import ListAllCourses from "../ListAllCourses";
import ChangePassword from "../ChangePassword";
import Ratings from "./Ratings";

function InstructorDashboard() {
  const [selectedSection, setSelectedSection] = useState("myCourses");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InstructorSidebar setSelectedSection={setSelectedSection} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedSection === "myCourses" && <CourseList />}
        {selectedSection === "createCourse" && <CreateCourse />}
        {selectedSection === "courseDetails" && <ListAllCourses />}
        {selectedSection === "editProfile" && <EditProfile />}
        {selectedSection === "changePassword" && <ChangePassword />}
        {selectedSection === "viewReviews" && <Ratings />}
      </div>
    </div>
  );
}

export default InstructorDashboard;
