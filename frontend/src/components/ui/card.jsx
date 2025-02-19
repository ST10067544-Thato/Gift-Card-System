// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, className = '', border = false }) => {
  return (
    <div
      style={{ marginTop: '64px' }} // Adjusts the card position for the navbar height
      className={`bg-white shadow-lg rounded-xl p-6 ${
        border ? "border-t-4 border-primary" : ""
      } ${className} mt-[64px] md:mt-[80px] overflow-hidden`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};
