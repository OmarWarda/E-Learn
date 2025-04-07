import React, { useState } from "react";
import CountrySelector from "../CountrySelector"; // Import the country selector

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [biography, setBiography] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null); // Lift state here
  const [message, setMessage] = useState("");

  const handleSaveChanges = async () => {
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3000/api/instructor/updateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            biography,
            country: selectedCountry ? selectedCountry.label : null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      setMessage("❌ Failed to update profile. Try again.");
    }
  };

  return (
    <div className="max-w-lg mt-4 m-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      {/* Name Input */}
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Full Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter your full name"
      />

      {/* Email Input */}
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter your email"
      />

      {/* Biography Input */}
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Mini Biography
      </label>
      <textarea
        value={biography}
        onChange={(e) => setBiography(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Write a short biography..."
        rows="3"
      />

      {/* Country Selector (Pass state & setter) */}
      <CountrySelector
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />

      {/* Save Button */}
      <button
        onClick={handleSaveChanges}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-4 hover:bg-blue-700 transition"
      >
        Save Changes
      </button>

      {/* Message Display */}
      {message && <p className="text-gray-600 text-sm mt-3">{message}</p>}
    </div>
  );
};

export default EditProfile;
