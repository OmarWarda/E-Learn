import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./components/admin/AdminPage";
import InstructorDashboard from "./components/instructor/InstructorDashboard";
import IndividualDashboard from "./components/individualTrainee/IndividualDashboard";
import CourseList from "./components/instructor/CourseList";
import CourseReviews from "./components/instructor/CourseReviews";
import CourseDetails from "./components/CourseDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<CourseList />} />
        <Route
          path="/instructor/reviews/:courseId"
          element={<CourseReviews />}
        />

        {/* Course Details */}
        <Route path="/course-details/:courseId" element={<CourseDetails />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Individual Trainee Dashboard */}
        <Route path="/trainee" element={<IndividualDashboard />} />

        {/* Default Route (Redirect to Login) */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
