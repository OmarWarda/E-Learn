import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../SearchFilter";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [maxPrice, setMaxPrice] = useState(500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      let query = "http://localhost:3000/api/course/getAllCourses?";

      if (searchQuery) query += `search=${searchQuery}&`;
      if (selectedSubject?.value) query += `major=${selectedSubject.value}&`;
      if (maxPrice) query += `price[lte]=${maxPrice}&`;

      try {
        const res = await fetch(query);
        const data = await res.json();
        if (data.status === "success") {
          setCourses(data.data.courses);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const debounce = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedSubject, maxPrice]);

  const handleViewReviews = (courseId) => {
    navigate(`/instructor/reviews/${courseId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Courses</h2>

      <SearchFilter
        onSearchChange={setSearchQuery}
        onSubjectChange={setSelectedSubject}
        onPriceChange={setMaxPrice}
        selectedSubject={selectedSubject}
        maxPrice={maxPrice}
        searchQuery={searchQuery}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {course.title}
              </h3>
              <p className="text-gray-500">
                {course.rating} ⭐ ({course.reviews.length} reviews)
              </p>
              <button
                onClick={() => handleViewReviews(course._id)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Reviews
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default CourseList;
