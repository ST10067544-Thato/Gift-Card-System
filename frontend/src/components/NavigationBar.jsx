import React, { useState, useCallback, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

export default function NavigationBar({ isLoggedIn, userEmail, userRole, logoUrl, onLogout }) {
  const location = useLocation();
  const dropdownRef = useRef(null); // Create a reference for the dropdown
  const menuRef = useRef(null); // Create a reference for the entire menu

  // Consolidating menu state management into one object
  const [menuState, setMenuState] = useState({
    isMenuOpen: false, // Tracks if the mobile menu is open
    isDropdownOpen: false, // Tracks if the user profile dropdown is open
    isLogoutConfirmOpen: false, // Tracks if logout confirmation modal is open
  });

  // Memoized function to toggle the mobile menu
  const toggleMenu = useCallback(() => {
    setMenuState(prevState => ({ ...prevState, isMenuOpen: !prevState.isMenuOpen }));
  }, []);

  // Memoized function to toggle the user profile dropdown
  const toggleDropdown = useCallback(() => {
    setMenuState(prevState => ({ ...prevState, isDropdownOpen: !prevState.isDropdownOpen }));
  }, []);

  // Memoized function to handle the confirmation of logout
  const handleLogoutConfirmation = useCallback(() => {
    setMenuState(prevState => ({ ...prevState, isLogoutConfirmOpen: true, isDropdownOpen: false }));
  }, []);

  // Memoized function to cancel logout confirmation
  const handleLogoutCancel = useCallback(() => {
    setMenuState(prevState => ({ ...prevState, isLogoutConfirmOpen: false }));
  }, []);

  // Memoized function to confirm logout and call the onLogout prop
  const handleLogoutConfirm = useCallback(() => {
    setMenuState(prevState => ({ ...prevState, isLogoutConfirmOpen: false }));
    onLogout(); // Call the logout function passed as a prop
  }, [onLogout]);

  // Determines if the current page is the Gift Card page
  const isGiftCardPage = location.pathname === "/gift-card";

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !menuRef.current.contains(event.target)) {
        setMenuState(prevState => ({ ...prevState, isDropdownOpen: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-lg p-4 fixed top-0 left-0 z-10" ref={menuRef}>
      {/* Main container for the navigation bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Company Logo" className="h-10 cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Menu Section */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Admin Button: Displays if the user is logged in and is an admin */}
          {isLoggedIn && userRole === "admin" && (
            <Link to={isGiftCardPage ? "/admin" : "/gift-card"}>
              <Button className="bg-primary text-white px-6 py-3 rounded-lg">
                {isGiftCardPage ? "Go to Admin Dashboard" : "Redeem a Gift Card"}
              </Button>
            </Link>
          )}

          {/* User Profile Dropdown: Displays if the user is logged in */}
          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <Button onClick={toggleDropdown} className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                <User className="w-5 h-5" />
                <span>{userEmail}</span>
              </Button>
              {menuState.isDropdownOpen && (
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

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <Button onClick={toggleMenu} className="text-gray-700 hover:text-primary">
            {menuState.isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu: Visible when 'isMenuOpen' state is true */}
      {menuState.isMenuOpen && (
        <div className="md:hidden bg-white p-4 mt-2 rounded-lg shadow-lg">
          <ul className="space-y-3">
            {/* Admin Button for Mobile: Shows if the user is logged in and is an admin */}
            {isLoggedIn && userRole === "admin" && (
              <li>
                <Link to={isGiftCardPage ? "/admin" : "/gift-card"}>
                  <Button className="w-full bg-primary text-white px-4 py-2 rounded-lg">
                    {isGiftCardPage ? "Go to Admin Dashboard" : "Redeem a Gift Card"}
                  </Button>
                </Link>
              </li>
            )}
            {/* Profile and Logout Options for Mobile */}
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</li>
            <li onClick={handleLogoutConfirmation} className="px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</li>
          </ul>
        </div>
      )}

      {/* Logout Confirmation Modal: Displays when 'isLogoutConfirmOpen' state is true */}
      {menuState.isLogoutConfirmOpen && (
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
