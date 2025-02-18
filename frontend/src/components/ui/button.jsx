// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold focus:outline-none transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
};