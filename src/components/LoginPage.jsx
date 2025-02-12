import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, User } from "lucide-react";

export default function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleLogin = () => {
      setIsLoading(true);
      // Simulate login
      setTimeout(() => {
        alert("Logged in successfully!");
        onLoginSuccess();  // Call this prop function to set isLoggedIn to true
        setIsLoading(false);
        // Redirect to the dashboard or another page
      }, 1000);
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-6">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-red-500">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 text-center">Login</h2>
  
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="w-5 h-5" />}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
              />
            </div>
  
            <Button
              onClick={handleLogin}
              className="w-full bg-red-500 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
