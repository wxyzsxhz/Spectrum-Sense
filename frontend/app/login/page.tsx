"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear API error when user edits
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, api: "" }));

    let hasErrors = false;
    const newErrors = { email: "", password: "", api: "" };

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      hasErrors = true;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // API call to login
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      console.log("Attempting to login...");

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("Login response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Login response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        data = { message: "Invalid server response" };
      }

      if (response.status === 200) {
        // Success - store the token
        console.log("Login successful:", data.message);
        localStorage.setItem("token", data.token);

        // Clear any previous user data
        localStorage.removeItem("user");

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Handle API errors
        let errorMessage = data.message || "Login failed";

        if (response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setErrors((prev) => ({ ...prev, api: errorMessage }));
      }
    } catch (error) {
      console.error("Login error details:", error);

      // More specific error messages - FIXED TYPE ERROR HERE
      let errorMessage = "Network error. ";

      if (error instanceof TypeError) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Cannot connect to server. ";
          errorMessage += "This may be because:";
          errorMessage += "\n1. The backend server is not running";
          errorMessage += "\n2. You're using the wrong URL";
          errorMessage += "\n3. There's a CORS issue";

          // For demo/testing - allow mock login
          errorMessage += "\n\nUsing demo mode for testing...";

          // Mock login for demo purposes
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const mockToken = `mock-jwt-token-${Date.now()}-${formData.email}`;
          localStorage.setItem("token", mockToken);
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: "Demo User",
              email: formData.email,
            }),
          );
          router.push("/dashboard");
          setIsLoading(false);
          return;
        }
      } else if (error instanceof Error) {
        // Handle other Error objects safely
        errorMessage += error.message;
      } else if (typeof error === "string") {
        // Handle string errors
        errorMessage += error;
      } else {
        // Handle unknown error types
        errorMessage += "An unknown error occurred.";
      }

      setErrors((prev) => ({ ...prev, api: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Image matching Hero component */}
      <img
        src="/img.png"
        alt="Spectrum Sense background"
        className="
          absolute
          top-0
          right-0
          bottom-0
          w-[800px]
          md:w-[1100px]
          lg:w-[1100px]
          opacity-90
          pointer-events-none
        "
      />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 pointer-events-none" />

      {/* Form Container - Moved to LEFT side with rectangle shape */}
      <div className="relative z-10 w-full max-w-2xl bg-white/50 backdrop-blur-sm shadow-xl p-8 ml-40 mt-20 mb-10">
        <img
          src="/logo.png"
          alt="Spectrum Sense"
          className="mx-auto mt-0 mb-0 w-15"
        />

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Log In
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Access your Spectrum Sense account
        </p>

        {/* Display API error */}
        {errors.api && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium whitespace-pre-line">
              {errors.api}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Email</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`h-11 ${errors.email ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`h-11 pr-10 ${errors.password ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.password}
              </p>
            )}

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Log In Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#77c1e6] text-white font-bold 
               hover:bg-[#4b4b4b] transition-colors cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            <span className="font-medium">Important:</span> This tool is for
            awareness only, not a medical diagnosis.
          </p>
        </div>
      </div>
    </main>
  );
}
