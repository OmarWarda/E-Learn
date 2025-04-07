import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CourseReviews() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/course/reviews/${courseId}`
        );
        const data = await res.json();

        if (data.status === "success") {
          setCourse({
            title: data.data.courseTitle,
            rating: data.data.courseRating,
          });
          setReviews(data.data.reviews || []);
        } else {
          console.error("Failed to fetch course reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseReviews();
  }, [courseId]);

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-10">Loading reviews...</p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Courses
      </button>

      {course && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
          <p className="text-gray-500">
            ⭐ {course.rating} ({reviews.length} reviews)
          </p>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6 text-gray-800">Reviews</h3>
      {reviews.length > 0 ? (
        <div className="space-y-4 mt-4">
          {reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded-lg bg-gray-100">
              <p className="font-semibold text-gray-700">
                {review.reviewer.firstName + " " + review.reviewer.lastName}
              </p>
              <p className="text-gray-500">{review.rating} ⭐ </p>
              <p className="text-gray-600">
                {review.reviewText || "No comment provided"}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No reviews yet.</p>
      )}
    </div>
  );
}

export default CourseReviews;
