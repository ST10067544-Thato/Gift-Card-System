// src/components/DateFilter.jsx
import React, { useState, useCallback } from "react";

const DateFilter = ({ onChange }) => {
  // State to track the selected date option and date value
  const [dateOption, setDateOption] = useState('');
  const [dateValue, setDateValue] = useState('');

  // Memoize the handleDateChange function to avoid unnecessary re-renders
  const handleDateChange = useCallback((e) => {
    const value = e.target.value;
    setDateValue(value);
    // Pass the selected date option and value to the parent component
    onChange(dateOption, value); 
  }, [dateOption, onChange]); // Dependency on dateOption to ensure it reflects the current selection

  return (
    <div className="mt-4 sm:mt-6 lg:mt-0 flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
      {/* Dropdown to select date filter option (Year, Month, or Specific Date) */}
      <select
        value={dateOption}
        onChange={(e) => setDateOption(e.target.value)} // Update dateOption state
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary w-full sm:w-36 lg:w-48"
      >
        <option value="">Filter by</option>
        <option value="year">Year</option>
        <option value="month">Month</option>
        <option value="date">Specific Date</option>
      </select>

      {/* Input field that changes based on the selected date option */}
      {dateOption && (
        <input
          type={dateOption === "year" ? "number" : dateOption === "month" ? "month" : "date"}
          value={dateValue}
          onChange={handleDateChange} // Handle date input change
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary w-full sm:w-36 lg:w-48"
        />
      )}
    </div>
  );
};

export default DateFilter;
