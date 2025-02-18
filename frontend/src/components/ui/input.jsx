// src/components/ui/input.jsx
import React from 'react';

export const Input = ({ value, onChange, placeholder, type = 'text', disabled = false, className = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryLight focus:outline-none transition-all duration-300 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400"
      } ${className}`}
    />
  );
};