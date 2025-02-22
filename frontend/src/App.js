import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GiftCardRedemption from "./components/GiftCardRedemption";
import LoginPage from "./components/LoginPage";
import NavigationBar from "./components/NavigationBar";
import AdminPage from "./components/AdminPage";
import './styles/ErrorPage.css'; 


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const email = sessionStorage.getItem("userEmail");
    const role = sessionStorage.getItem("userRole");

    if (token && email && role) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserRole(role);
    }

    setIsLoading(false); // Set loading to false after checking sessionStorage
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return (
    <BrowserRouter>
      <div>
        {isLoggedIn && (
          <NavigationBar
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            logoUrl="/logo.png"
            onLogout={() => {
              sessionStorage.clear();
              setIsLoggedIn(false);
              setUserEmail("");
              setUserRole("");
            }}
            userRole={userRole}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <LoginPage onLoginSuccess={(email, role, token) => {
                  sessionStorage.setItem("authToken", token);
                  sessionStorage.setItem("userEmail", email);
                  sessionStorage.setItem("userRole", role);
                  setIsLoggedIn(true);
                  setUserEmail(email);
                  setUserRole(role);
                }} />
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
          <Route
            path="*"
            element={
              <div className="error-page">
                <h2>Oops! Page not found</h2>
                <p>It seems like you've entered an invalid URL or discovered a hidden page.</p>
                <Navigate to="/" />
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
