import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3000/api/course/getCourse/${courseId}`
        );
        const data = await res.json();

        if (data.status === "success") {
          setCourse(data.data.course);
        } else {
          setError("Failed to load course details.");
        }
      } catch (err) {
        setError("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading)
    return <p className="text-blue-500 text-center text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center text-lg">{error}</p>;
  if (!course)
    return (
      <p className="text-gray-500 text-center text-lg">Course not found.</p>
    );

  const finalPrice = course.price - (course.price * course.discount) / 100;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Courses
      </button>

      <h2 className="text-3xl font-extrabold mb-4 text-gray-900">
        {course.title}
      </h2>

      <p className="text-gray-700 text-lg mb-3">
        <span className="font-semibold">Instructor:</span>{" "}
        {course.instructor.fullName}
      </p>

      <div className="flex items-center text-lg text-yellow-500 mb-3">
        <span className="font-semibold text-gray-700">Rating:</span>
        <span className="ml-2">{course.rating} ⭐</span>
      </div>

      <p className="text-lg text-gray-700 mb-3">
        <span className="font-semibold">Total Hours:</span> {course.totalHours}{" "}
        hrs
      </p>

      <div className="bg-gray-100 p-5 rounded-lg shadow-sm mb-6">
        {course.discount > 0 ? (
          <div>
            <p className="text-gray-500 text-lg line-through">
              Original Price: ${course.price.toFixed(2)}
            </p>
            <p className="text-green-600 text-2xl font-bold">
              Discounted Price: ${finalPrice.toFixed(2)}
            </p>
            <p className="text-red-500 font-medium">{course.discount}% OFF</p>
          </div>
        ) : (
          <p className="text-xl text-gray-800 font-semibold">
            Price: ${course.price.toFixed(2)}
          </p>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Subtitles</h3>
        <ul className="list-disc list-inside text-gray-700">
          {course.subtitles.map((subtitle, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{subtitle.title}</span> -{" "}
              {subtitle.totalHours} hrs, {subtitle.exercises} exercises
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CourseDetails;
