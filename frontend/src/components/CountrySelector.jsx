import React from "react";
import Select from "react-select";
import countries from "world-countries";

// Convert countries data into `react-select` format
const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  const handleChange = async (selectedOption) => {
    setSelectedCountry(selectedOption); // Lift state to parent
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-80">
      <h2 className="text-md font-semibold mb-2 text-gray-700">
        Select Your Country (Optional)
      </h2>
      <Select
        options={countryOptions}
        value={selectedCountry}
        onChange={handleChange}
        isClearable
        placeholder="Choose a country..."
        className="text-sm"
      />
    </div>
  );
};

export default CountrySelector;
