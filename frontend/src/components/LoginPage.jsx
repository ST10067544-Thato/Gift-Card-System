import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, User } from "lucide-react";

// LoginPage component to handle user login
export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState(""); // Username or Email input
  const [password, setPassword] = useState(""); // Password input
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button
  const [errorMessage, setErrorMessage] = useState(""); // To handle login errors

  // Handle login logic
const handleLogin = async () => {
  setIsLoading(true); // Set loading state to true while processing login
  setErrorMessage(""); // Reset error message

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    const data = await response.json();
    const isAdmin = data.isAdmin; // Check if user is admin
    onLoginSuccess(username, isAdmin); // Pass email and isAdmin flag
  } catch (error) {
    setErrorMessage(error.message); // Set error message on failed login
  } finally {
    setIsLoading(false); // Set loading state back to false after processing
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Login Card */}
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-16" />
        </div>

        {/* Card Content Section */}
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-primary">Gift Card Database</h2>

          <div className="space-y-4">
            {/* Username or Email Input */}
            <Input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="w-5 h-5" />}
              className="focus:outline-none focus:ring-2 focus:ring-primaryLight"
            />
            {/* Password Input */}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              className="focus:outline-none focus:ring-2 focus:ring-primaryLight"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full text-white bg-primary hover:bg-primaryDark"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
