import React, { useState } from "react";
import axios from "axios";
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  if (!API_BASE_URL) {
    console.error("Missing API_BASE_URL environment variable.");
  }

  // Handle login logic
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Email and Password are required.");
      return;
    }
  
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email: username.trim().toLowerCase(), // Convert email to lowercase
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials (cookies)
        }
      );
  
      const data = response.data;
  
      if (response.status === 200) {
        // Extract token, email, and role from the response
        const { token, email, role } = data;
  
        // Store token, email, and role in sessionStorage
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("userRole", role);
  
        // Log the stored values for debugging
        console.log("Token after login:", token);
        console.log("Role after login:", role);
  
        // Pass email, role, and token to the parent component
        onLoginSuccess(email, role, token);
      } else {
        throw new Error(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
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
              autoComplete="email"
              className="focus:outline-none focus:ring-2 focus:ring-primaryLight"
            />
            {/* Password Input */}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              autoComplete="current-password"
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