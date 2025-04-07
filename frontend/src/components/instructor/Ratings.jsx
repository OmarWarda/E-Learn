import React, { useEffect, useState } from "react";

const Ratings = () => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch instructor details based on the token
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await fetch(
          "http://localhost:3000/api/instructor/getInstructor",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setInstructor(data.data.instructor);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch instructor data.");
        setLoading(false);
      }
    };

    fetchInstructor();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-xl text-blue-500 font-bold">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-xl text-red-500 font-bold">{error}</p>
    );
  }

  if (!instructor) {
    return (
      <p className="text-center text-xl text-red-500 font-bold">
        Instructor not found.
      </p>
    );
  }

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          {instructor.fullName || "Instructor Name"}{" "}
          <span className="text-xl font-semibold text-gray-800">
            ( {calculateAverageRating(instructor.reviews)} ⭐ )
          </span>
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        <p className="text-lg text-gray-600">
          <strong>Email:</strong> {instructor.email}
        </p>
        <p className="text-lg text-gray-600">
          <strong>Country:</strong> {instructor.country}
        </p>
        <p className="text-lg text-gray-600">
          <strong>Biography:</strong>{" "}
          {instructor.biography || "No biography available."}
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reviews:</h3>
        {instructor.reviews && instructor.reviews.length > 0 ? (
          <ul className="space-y-4">
            {instructor.reviews.map((review) => (
              <li
                key={review._id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-lg text-gray-800">
                    {review.reviewer.firstName} {review.reviewer.lastName}{" "}
                    <span className="text-xl text-gray-800">
                      ( {review.rating} ⭐ )
                    </span>
                  </strong>
                </div>
                <p className="text-gray-700 mb-2">
                  {review.reviewText || "No review text provided."}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Ratings;
