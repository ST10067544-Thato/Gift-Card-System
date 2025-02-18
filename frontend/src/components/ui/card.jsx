// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, className = '', border = false }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 ${
        border ? "border-t-4 border-primary" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};