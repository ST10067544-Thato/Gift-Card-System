import React, { useState } from "react";
import { Menu, X, User } from "lucide-react"; // Import lucide icons
import { Button } from "./ui/button"; // Assuming Button component is available

export default function NavigationBar({ isLoggedIn, userEmail, logoUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle mobile menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle user dropdown

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle the user dropdown menu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    isLoggedIn && ( // Only render if the user is logged in
      <nav className="w-full bg-white shadow-md p-4 fixed top-0 left-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Company Logo */}
          <div className="flex items-center">
            <img src={logoUrl} alt="Company Logo" className="h-10" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Icon / Email Dropdown */}
            <div className="relative">
              <Button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-black hover:text-primary"
              >
                <User className="w-5 h-5" />
                <span>{userEmail}</span>
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <ul>
                    <li className="px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</li>
                    <li className="px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button onClick={toggleMenu} className="text-black">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white p-4">
            <ul>
              <li className="py-2 text-gray-700 hover:bg-gray-100">Profile</li>
              <li className="py-2 text-gray-700 hover:bg-gray-100">Logout</li>
            </ul>
          </div>
        )}
      </nav>
    )
  );
}
