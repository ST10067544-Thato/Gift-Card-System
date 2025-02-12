import React, { useState } from "react";
import GiftCardRedemption from "./components/GiftCardRedemption";
import LoginPage from "./components/LoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <GiftCardRedemption />
      )}
    </div>
  );
}

export default App;
