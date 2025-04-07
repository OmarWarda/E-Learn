import { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function ListAllCourses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedRating, setSelectedRating] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      let query = "http://localhost:3000/api/course/getAllCourses?";
      if (searchQuery) query += `search=${searchQuery}&`;
      if (selectedSubject?.value) query += `major=${selectedSubject.value}&`;
      if (maxPrice) query += `price[lte]=${maxPrice}&`;
      if (selectedRating) query += `rating[gte]=${selectedRating.value}&`;

      try {
        const res = await fetch(query);
        const data = await res.json();
        if (data.status === "success") {
          setCourses(data.data.courses);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (error) {
        setError("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedSubject, maxPrice, selectedRating]);

  const ratingOptions = [
    { value: 1, label: "1 Star" },
    { value: 2, label: "2 Stars" },
    { value: 3, label: "3 Stars" },
    { value: 4, label: "4 Stars" },
    { value: 5, label: "5 Stars" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Courses</h2>

      <SearchFilter
        onSearchChange={setSearchQuery}
        onSubjectChange={setSelectedSubject}
        onPriceChange={setMaxPrice}
        selectedSubject={selectedSubject}
        maxPrice={maxPrice}
        searchQuery={searchQuery}
      />

      {/* Rating Filter */}
      <div className="mb-4">
        <label className="text-gray-700 text-sm font-medium mb-1">
          Filter by Rating
        </label>
        <Select
          value={selectedRating}
          onChange={setSelectedRating}
          options={ratingOptions}
          className="w-full md:w-1/4"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "8px",
              padding: "2px",
              boxShadow: "none",
              borderColor: "#ccc",
              "&:hover": { borderColor: "#888" },
            }),
          }}
        />
      </div>

      {/* Loading & Error Handling */}
      {loading && (
        <p className="text-blue-500 text-center">Loading courses...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length > 0
          ? courses.map((course) => (
              <div
                key={course._id}
                className="w-full md:w-[340px] bg-white shadow-md rounded-lg p-3 flex flex-col justify-between"
              >
                <h3 className="text-md font-semibold text-center">
                  {course.title}
                </h3>

                {/* Embedded Video */}
                {course.previewVideo && (
                  <iframe
                    width="100%"
                    height="190"
                    src={
                      course.previewVideo.includes("watch?v=")
                        ? course.previewVideo.replace("watch?v=", "embed/")
                        : course.previewVideo
                    }
                    title={course.title}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-md my-2"
                  ></iframe>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => navigate(`/course-details/${course._id}`)}
                  className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            ))
          : !loading && (
              <p className="text-gray-500 text-center w-full">
                No courses found.
              </p>
            )}
      </div>
    </div>
  );
}

export default ListAllCourses;
