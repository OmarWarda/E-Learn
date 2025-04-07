import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false); // New state to track policy acceptance
  const [showPolicy, setShowPolicy] = useState(false); // State to handle policy modal visibility
  const navigate = useNavigate();

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if all required fields are filled, passwords match, and policy is accepted
    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.gender
    ) {
      return setError("All fields except email are required.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!acceptedPolicy) {
      return setError("You must accept the Refund/Payment Policy to continue.");
    }

    const dataToSend = {
      ...formData,
      email: formData.email === "" ? null : formData.email,
    };

    setLoading(true);

    try {
      // Send POST request to signup endpoint
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        // On success, save the token to localStorage
        localStorage.setItem("token", data.token);

        // Navigate to /individual
        navigate("/trainee");
      } else {
        // On error, show the error message
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Join Us Today!
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <Select
            options={genderOptions}
            onChange={(selectedOption) =>
              setFormData({ ...formData, gender: selectedOption.value })
            }
            value={genderOptions.find(
              (option) => option.value === formData.gender
            )}
            placeholder="Select Gender"
            className="w-full"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

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
                Refund/Payment Policy
              </button>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Modal for displaying the Refund/Payment Policy */}
        {showPolicy && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-3xl">
              <h3 className="text-xl font-semibold mb-4">
                Refund/Payment Policy
              </h3>
              <p>
                {/* Your policy content here */}
                No Take backs sorry.
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
      </div>
    </div>
  );
};

export default Signup;
