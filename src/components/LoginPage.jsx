import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, User } from "lucide-react";

// LoginPage component to handle user login
export default function LoginPage({ onLoginSuccess }) {
  // State to manage the form inputs and loading state
  const [username, setUsername] = useState(""); // Username or Email input
  const [password, setPassword] = useState(""); // Password input
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  // Handle login logic
  const handleLogin = () => {
    setIsLoading(true); // Set loading state to true while processing login
    setTimeout(() => {
      alert("Logged in successfully!");
      onLoginSuccess();  // Trigger onLoginSuccess callback after successful login
      setIsLoading(false); // Set loading state back to false after processing
    }, 1000); // Simulate an API call with a 1-second delay
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Login Card */}
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        
        {/* Logo Section: Displays the logo above the login form */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-16" /> {/* Adjust logo size as needed */}
        </div>

        {/* Card Content Section: Contains the form inputs and button */}
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-primary">Gift Card Database</h2>

          <div className="space-y-4">
            {/* Username or Email Input */}
            <Input
              type="email" // Use type="email" for automatic email validation
              placeholder="Email" // Updated placeholder to reflect email input
              value={username} // Bind the username state
              onChange={(e) => setUsername(e.target.value)} // Update username state on input change
              icon={<User className="w-5 h-5" />} // User icon
              className="focus:outline-none focus:ring-2 focus:ring-primaryLight" // Focus styles
            />
            {/* Password Input */}
            <Input
              type="password" // Password field, input type is "password"
              placeholder="Password" // Placeholder for password
              value={password} // Bind the password state
              onChange={(e) => setPassword(e.target.value)} // Update password state on input change
              icon={<Lock className="w-5 h-5" />} // Lock icon for password
              className="focus:outline-none focus:ring-2 focus:ring-primaryLight" // Focus styles
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin} // Handle login on button click
            className="w-full text-white bg-primary hover:bg-primaryDark" // Styling for the button
            disabled={isLoading} // Disable the button if loading
          >
            {isLoading ? "Logging in..." : "Login"} {/* Conditional text based on loading state */}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
