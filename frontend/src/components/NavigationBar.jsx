import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

export default function NavigationBar({ isLoggedIn, userEmail, userRole, logoUrl, onLogout }) {
  console.log("userRole:", userRole);

  const location = useLocation(); // Get the current route
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogoutConfirmation = () => {
    setIsLogoutConfirmOpen(true);
    setIsDropdownOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutConfirmOpen(false);
    onLogout();
  };

  // Determine if the user is on the Gift Card page
  const isGiftCardPage = location.pathname === "/gift-card";

  return (
    <nav className="w-full bg-white shadow-lg p-4 fixed top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Company Logo" className="h-10 cursor-pointer" />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {/* Check if userRole is 'admin' to render button */}
          {isLoggedIn && userRole === "admin" && (
            <Link to={isGiftCardPage ? "/admin" : "/gift-card"}>
              <Button className="bg-primary text-white px-6 py-3 rounded-lg">
                {isGiftCardPage ? "Go to Admin Dashboard" : "Redeem a Gift Card"}
              </Button>
            </Link>
          )}

          {isLoggedIn && (
            <div className="relative">
              <Button onClick={toggleDropdown} className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                <User className="w-5 h-5" />
                <span>{userEmail}</span>
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <ul>
                    <li className="px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</li>
                    <li onClick={handleLogoutConfirmation} className="px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:hidden">
          <Button onClick={toggleMenu} className="text-gray-700 hover:text-primary">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 mt-2 rounded-lg shadow-lg">
          <ul>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</li>
            <li onClick={handleLogoutConfirmation} className="px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</li>
          </ul>
        </div>
      )}

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-6 text-center">Are you sure you want to log out?</h3>
            <div className="flex justify-center gap-6">
              <Button onClick={handleLogoutCancel} className="bg-gray-200 text-gray-700">Cancel</Button>
              <Button onClick={handleLogoutConfirm} className="bg-red-500 text-white">Logout</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
