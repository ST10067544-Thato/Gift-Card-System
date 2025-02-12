import React, { useState } from "react";
import GiftCardRedemption from "./components/GiftCardRedemption";
import LoginPage from "./components/LoginPage";
import NavigationBar from "./components/NavigationBar"; // Import the NavigationBar component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Store user's email
  const logoUrl = "/logo.png"; // Provide the path to your company logo

  // Handle login success
  const handleLoginSuccess = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email); // Set the logged-in user's email
  };

  return (
    <div>
      {/* Render the navigation bar only if the user is logged in */}
      {isLoggedIn && (
        <NavigationBar
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          logoUrl={logoUrl}
        />
      )}

      {/* Show the LoginPage if the user is not logged in, otherwise show the GiftCardRedemption */}
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <GiftCardRedemption />
      )}
    </div>
  );
}

export default App;
