import React, { useState } from "react";

const Form = ({ title, buttonText, selectedSection }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // Object to store message and type

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const apiUrl =
      selectedSection === "admin"
        ? "http://localhost:3000/api/admin/addadmin"
        : selectedSection === "instructor"
        ? "http://localhost:3000/api/admin/addInstructor"
        : "http://localhost:3000/api/admin/addCorporate";

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Success: ${data.message}`, type: "success" });
        setUsername(""); // Clear input fields
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ text: `Error: ${data.message}`, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md border border-gray-200"
    >
      <h2 className="text-xl font-bold mb-5">{title}</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md font-semibold hover:scale-105 transition duration-300 shadow-md"
      >
        {loading ? "Adding..." : buttonText}
      </button>

      {message.text && (
        <p
          className={`mt-3 text-center text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default Form;
