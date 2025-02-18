import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import GiftCardRedemption from "./components/GiftCardRedemption";
import LoginPage from "./components/LoginPage";
import NavigationBar from "./components/NavigationBar";
import AdminPage from "./components/AdminPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Store user's email
  const [userRole, setUserRole] = useState(""); // Dynamically set user role
  const logoUrl = "/logo.png"; // Provide the path to your company logo

  // Retrieve login info from cookies on app load
  useEffect(() => {
    const email = Cookies.get("userEmail");
    const role = Cookies.get("userRole");

    if (email && role) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = (email, isAdmin) => {
    // Set cookies for email and role
    Cookies.set("userEmail", email, { expires: 7 }); // Expires in 7 days
    Cookies.set("userRole", isAdmin ? "admin" : "store", { expires: 7 });

    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(isAdmin ? "admin" : "store");
  };

  // Handle logout
  const handleLogout = () => {
    // Remove cookies on logout
    Cookies.remove("userEmail");
    Cookies.remove("userRole");

    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("");
  };

  return (
    <BrowserRouter>
      <div>
        {/* Render the navigation bar only if the user is logged in */}
        {isLoggedIn && (
          <NavigationBar
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            logoUrl={logoUrl}
            onLogout={handleLogout} // Pass the logout function to NavigationBar
            userRole={userRole} // Pass userRole to NavigationBar
          />
        )}

        {/* Define routes */}
        <Routes>
          {/* Redirect to login if not logged in */}
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              ) : userRole === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/gift-card" />
              )
            }
          />
          {/* Gift Card Redemption Page - Accessible to both admins and store users */}
          <Route
            path="/gift-card"
            element={
              isLoggedIn && (userRole === "store" || userRole === "admin") ? (
                <GiftCardRedemption userRole={userRole} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* Admin Page */}
          <Route
            path="/admin"
            element={
              isLoggedIn && userRole === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
