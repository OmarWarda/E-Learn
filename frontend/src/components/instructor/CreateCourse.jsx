import { useState } from "react";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [subtitles, setSubtitles] = useState([""]);
  const [price, setPrice] = useState("");
  const [summary, setSummary] = useState("");
  const [previewVideo, setPreviewVideo] = useState(""); // New state for YouTube link
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const [acceptedPolicy, setAcceptedPolicy] = useState(false); // New state to track policy acceptance
  const [showPolicy, setShowPolicy] = useState(false); // State to handle policy modal visibility

  // Add a subtitle input field
  const addSubtitle = () => setSubtitles([...subtitles, ""]);

  // Remove a subtitle input field
  const removeSubtitle = (index) => {
    const newSubtitles = [...subtitles];
    newSubtitles.splice(index, 1);
    setSubtitles(newSubtitles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !summary || !subject) {
      setMessageType("error");
      setMessage("Title, price, summary, and subject are required.");
      return;
    }

    // Validate price to be a number and greater than 0
    if (isNaN(price) || parseFloat(price) <= 0) {
      setMessageType("error");
      setMessage("Please enter a valid price.");
      return;
    }

    if (!acceptedPolicy) {
      return setError("You must accept the Refund/Payment Policy to continue.");
    }

    const courseData = {
      title,
      subject,
      subtitles,
      price: parseFloat(price),
      summary,
      previewVideo,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3000/api/course/createCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(courseData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Course created successfully!");
        setMessageType("success");

        // Reset form fields
        setTitle("");
        setSubject("");
        setSubtitles([""]);
        setPrice("");
        setSummary("");
        setPreviewVideo("");
      } else {
        setMessage(`❌ Error: ${result.message}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("❌ Failed to create course. Try again later.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 rounded-lg h-[90vh]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl flex flex-col h-[80vh]">
        <h2 className="text-2xl font-bold text-gray-800 text-center pb-3">
          🎓 Create a New Course
        </h2>
        <div className="flex-1 overflow-y-auto px-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Course Title */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title..."
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject..."
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Subtitles */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Subtitles
              </label>
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                {subtitles.map((subtitle, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) =>
                        setSubtitles([
                          ...subtitles.slice(0, index),
                          e.target.value,
                          ...subtitles.slice(index + 1),
                        ])
                      }
                      placeholder={`Subtitle ${index + 1}`}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                    {subtitles.length >= 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubtitle(index)}
                        className=" text-white rounded-full p-1"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubtitle}
                  className="bg-blue-500 text-white rounded-full p-1 mt-2"
                >
                  + Add Subtitle
                </button>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Set a price..."
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Short Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe the course..."
                rows="3"
                className="w-full border rounded-lg px-4 py-2"
              ></textarea>
            </div>

            {/* YouTube Video Link */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Course Preview Video (YouTube)
              </label>
              <input
                type="url"
                value={previewVideo}
                onChange={(e) => setPreviewVideo(e.target.value)}
                placeholder="Enter YouTube video link..."
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Checkbox for accepting the policy */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="policy"
                checked={acceptedPolicy}
                onChange={(e) => setAcceptedPolicy(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="policy" className="text-sm">
                I have read and accept the{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicy(true)}
                  className="text-blue-600 hover:underline"
                >
                  Content Licensing & Revenue Agreement
                </button>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2.5 rounded-lg"
            >
              🚀 Create Course
            </button>

            {/* Modal for displaying the Refund/Payment Policy */}
            {showPolicy && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-4/5 max-w-3xl">
                  <h3 className="text-xl font-semibold mb-4">
                    Content Licensing & Revenue Agreement
                  </h3>
                  <p>
                    {/* Your policy content here */}
                    Instructor Agreement By creating a course an instructor on
                    our platform, you agree to the following terms: Content
                    Ownership & Licensing You retain ownership of the videos and
                    materials you upload. By publishing content on our platform,
                    you grant us a worldwide, non-exclusive license to
                    distribute and promote your content. Revenue Sharing we take
                    a 100 % commission on each course purchase per registered
                    trainee. Payouts will be made on a monthly basis, subject to
                    a minimum withdrawal amount of 0€. Content Removal & Policy
                    Compliance we reserve the right to remove content that
                    violates platform guidelines. You must ensure that all
                    uploaded materials comply with copyright laws. Termination
                    You may request content removal, but any active purchases
                    will still be honored. Violation of terms may result in
                    account suspension.
                  </p>
                  <button
                    onClick={() => setShowPolicy(false)}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Success/Error Message */}
            {message && (
              <div
                className={`p-3 mb-2 text-center font-medium text-sm rounded-lg ${
                  messageType === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
