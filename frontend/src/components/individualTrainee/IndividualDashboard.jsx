import { useState } from "react";
import IndividualSideBar from "./IndividualSideBar";
import ListAllCourses from "../ListAllCourses";
import CountrySelector from "../CountrySelector";

function IndividualDashboard() {
  const [selectedSection, setSelectedSection] = useState("myCourses");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <IndividualSideBar setSelectedSection={setSelectedSection} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedSection === "courseDetails" && <ListAllCourses />}
        {selectedSection === "selectCountry" && (
          <CountrySelector role="individual" />
        )}
      </div>
    </div>
  );
}

export default IndividualDashboard;
