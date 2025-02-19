import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GiftCardRedemption from "./components/GiftCardRedemption";
import LoginPage from "./components/LoginPage";
import NavigationBar from "./components/NavigationBar";
import AdminPage from "./components/AdminPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const logoUrl = "/logo.png"; 

  // Retrieve login info on app load
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const email = sessionStorage.getItem("userEmail");
    const role = sessionStorage.getItem("userRole");

    if (token && email && role) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = (email, role, token) => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userRole", role);

    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear(); // Clears all session data
    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("");
  };

  return (
    <BrowserRouter>
      <div>
        {/* Show the navigation bar only if the user is logged in */}
        {isLoggedIn && (
          <NavigationBar
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            logoUrl={logoUrl}
            onLogout={handleLogout}
            userRole={userRole}
          />
        )}

        <Routes>
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
