import { useState } from "react";
import Select from "react-select"; // Import react-select

// SearchFilter Component
const SearchFilter = ({
  onSearchChange,
  onSubjectChange,
  onPriceChange,
  selectedSubject,
  maxPrice,
  searchQuery,
}) => {
  // Options for react-select
  const subjectOptions = [
    { value: null, label: "All Subjects" },
    { value: "computer science", label: "Computer Science" },
    { value: "Medicine", label: "Medicine" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "Engineering", label: "Engineering" },
  ];

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title, subject, or instructor..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2 w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Subject Filter using react-select */}
      <Select
        value={selectedSubject}
        onChange={onSubjectChange}
        options={subjectOptions}
        className="w-full md:w-1/4"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "20px",
            padding: "2px",
            boxShadow: "none",
            borderColor: "#ccc",
            "&:hover": { borderColor: "#888" },
          }),
        }}
      />

      {/* Price Range Slider */}
      <div className="flex flex-col items-center w-full md:w-1/4">
        <label className="text-gray-700 text-sm font-medium mb-1">
          Max Price: ${maxPrice}
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={maxPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
};

export default SearchFilter;
