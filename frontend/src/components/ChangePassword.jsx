import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    setMessage("");

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("❌ All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("❌ New password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/instructor/updateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to change password");

      setMessage("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("❌ Failed to change password. Try again.");
    }
  };

  return (
    <div className="max-w-lg mt-4 ml-64 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>

      {/* Current Password */}
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Current Password
      </label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter current password"
      />

      {/* New Password */}
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        New Password
      </label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter new password"
      />

      {/* Confirm New Password */}
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Confirm New Password
      </label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Confirm new password"
      />

      {/* Submit Button */}
      <button
        onClick={handleChangePassword}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-4 hover:bg-blue-700 transition"
      >
        Change Password
      </button>

      {/* Message Display */}
      {message && <p className="text-gray-600 text-sm mt-3">{message}</p>}
    </div>
  );
};

export default ChangePassword;
