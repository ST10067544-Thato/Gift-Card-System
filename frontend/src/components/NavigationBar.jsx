import React, { useState, useCallback, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

export default function NavigationBar({ isLoggedIn, userEmail, userRole, logoUrl, onLogout }) {
  const location = useLocation();
  const dropdownRef = useRef(null); // Dropdown reference
  const menuRef = useRef(null); // Menu reference

  // Consolidated state for menu controls
  const [menuState, setMenuState] = useState({
    isMenuOpen: false,
    isDropdownOpen: false,
    isLogoutConfirmOpen: false,
  });

  // Toggles mobile menu
  const toggleMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);

  // Toggles profile dropdown
  const toggleDropdown = useCallback(() => {
    setMenuState(prev => ({ ...prev, isDropdownOpen: !prev.isDropdownOpen }));
  }, []);

  // Handles logout confirmation popup
  const handleLogoutConfirmation = useCallback(() => {
    setMenuState(prev => ({ ...prev, isLogoutConfirmOpen: true, isDropdownOpen: false }));
  }, []);

  // Cancels logout confirmation
  const handleLogoutCancel = useCallback(() => {
    setMenuState(prev => ({ ...prev, isLogoutConfirmOpen: false }));
  }, []);

  // Confirms logout
  const handleLogoutConfirm = useCallback(() => {
    setMenuState(prev => ({ ...prev, isLogoutConfirmOpen: false }));
    onLogout(); // Execute logout action
  }, [onLogout]);

  // Check if current page is the Gift Card page
  const isGiftCardPage = location.pathname === "/gift-card";

  // Closes dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setMenuState(prev => ({ ...prev, isDropdownOpen: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-lg p-4 fixed top-0 left-0 z-10" ref={menuRef}>
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Company Logo" className="h-10 cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Admin Button (Conditional Rendering) */}
          {isLoggedIn && userRole === "admin" && (
            <Link to={isGiftCardPage ? "/admin" : "/gift-card"}>
              <Button className="bg-primary text-white px-6 py-3 rounded-lg">
                {isGiftCardPage ? "Go to Admin Dashboard" : "Redeem a Gift Card"}
              </Button>
            </Link>
          )}

          {/* User Profile Dropdown (If Logged In) */}
          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <Button onClick={toggleDropdown} className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                <User className="w-5 h-5" />
                <span>{userEmail}</span>
              </Button>
              {menuState.isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <ul>
                    {/* Profile Option (Currently Non-Functional) */}
                    <li>
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </button>
                    </li>
                    {/* Logout Option */}
                    <li>
                      <button 
                        onClick={handleLogoutConfirmation} 
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button onClick={toggleMenu} className="text-gray-700 hover:text-primary">
            {menuState.isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuState.isMenuOpen && (
        <div className="md:hidden bg-white p-4 mt-2 rounded-lg shadow-lg">
          <ul className="space-y-3">
            {/* Admin Button (For Mobile) */}
            {isLoggedIn && userRole === "admin" && (
              <li>
                <Link to={isGiftCardPage ? "/admin" : "/gift-card"}>
                  <Button className="w-full bg-primary text-white px-4 py-2 rounded-lg">
                    {isGiftCardPage ? "Go to Admin Dashboard" : "Redeem a Gift Card"}
                  </Button>
                </Link>
              </li>
            )}
            {/* Profile & Logout (Mobile) */}
            <li>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                Profile
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogoutConfirmation} 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Logout Confirmation Modal */}
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
