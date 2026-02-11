"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    api: "", // Add API error state
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Password requirements
  const passwordRequirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= passwordRequirements.minLength) strength += 20;
    if (passwordRequirements.hasUpperCase.test(password)) strength += 20;
    if (passwordRequirements.hasLowerCase.test(password)) strength += 20;
    if (passwordRequirements.hasNumber.test(password)) strength += 20;
    if (passwordRequirements.hasSpecialChar.test(password)) strength += 20;

    return strength;
  };

  // Validate password
  const validatePassword = (password: string) => {
    const errors = [];

    if (password.length < passwordRequirements.minLength) {
      errors.push(`At least ${passwordRequirements.minLength} characters`);
    }
    if (!passwordRequirements.hasUpperCase.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!passwordRequirements.hasLowerCase.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!passwordRequirements.hasNumber.test(password)) {
      errors.push("One number");
    }
    if (!passwordRequirements.hasSpecialChar.test(password)) {
      errors.push("One special character");
    }

    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));

    // Update password strength
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);

    // Show requirements when user starts typing
    if (value.length > 0 && !showPasswordRequirements) {
      setShowPasswordRequirements(true);
    }

    // Clear password error
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    // Clear confirm password error if passwords now match
    if (errors.confirmPassword && value === formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    // Clear API error when user edits
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, confirmPassword: value }));

    // Clear error when user starts typing
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    // Clear API error when user edits
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    // Clear API error when user edits
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
    // Clear API error when user edits
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, api: "" }));

    let hasErrors = false;

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrors((prev) => ({ ...prev, password: passwordErrors.join(", ") }));
      hasErrors = true;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match. Please retype.",
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      // Call the backend API
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success - store the token
        console.log("Signup successful:", data.message);
        localStorage.setItem("token", data.token);

        // Redirect to dashboard or login page
        router.push("/login"); // or "/login" if you want them to login first
      } else {
        // Handle API errors
        let errorMessage = data.message || "Signup failed";

        if (response.status === 400) {
          errorMessage = "Email already in use. Please use a different email.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setErrors((prev) => ({ ...prev, api: errorMessage }));
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors((prev) => ({
        ...prev,
        api: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Get password strength color
  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "text-red-500";
    if (strength < 80) return "text-yellow-500";
    return "text-green-600";
  };

  // Get password strength text
  const getStrengthText = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 80) return "Medium";
    return "Strong";
  };

  // Get strength bar color
  const getStrengthBarColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-600";
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
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Join Spectrum Sense to access ASD risk analysis tools
        </p>

        {/* Display API error */}
        {errors.api && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">{errors.api}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-700">Name</Label>
            <Input
              required
              placeholder="Parent Name"
              value={formData.name}
              onChange={handleNameChange}
              className="h-11"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Email</Label>
            <Input
              type="email"
              required
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleEmailChange}
              className="h-11"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handlePasswordChange}
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

            {/* Password strength indicator - only show when user is typing */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    Password strength:
                  </span>
                  <span
                    className={`text-xs font-semibold ${getStrengthColor(passwordStrength)}`}
                  >
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthBarColor(passwordStrength)}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}

            {/* Password requirements list - only show when user starts typing */}
            {showPasswordRequirements && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Password must contain:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li
                    className={`flex items-center ${formData.password.length >= 8 ? "text-green-600" : ""}`}
                  >
                    <span className="mr-1">
                      {formData.password.length >= 8 ? "✓" : "○"}
                    </span>
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${passwordRequirements.hasUpperCase.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <span className="mr-1">
                      {passwordRequirements.hasUpperCase.test(formData.password)
                        ? "✓"
                        : "○"}
                    </span>
                    One uppercase letter (A-Z)
                  </li>
                  <li
                    className={`flex items-center ${passwordRequirements.hasLowerCase.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <span className="mr-1">
                      {passwordRequirements.hasLowerCase.test(formData.password)
                        ? "✓"
                        : "○"}
                    </span>
                    One lowercase letter (a-z)
                  </li>
                  <li
                    className={`flex items-center ${passwordRequirements.hasNumber.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <span className="mr-1">
                      {passwordRequirements.hasNumber.test(formData.password)
                        ? "✓"
                        : "○"}
                    </span>
                    One number (0-9)
                  </li>
                  <li
                    className={`flex items-center ${passwordRequirements.hasSpecialChar.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <span className="mr-1">
                      {passwordRequirements.hasSpecialChar.test(
                        formData.password,
                      )
                        ? "✓"
                        : "○"}
                    </span>
                    One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500 font-medium mt-2">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Retype your password"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`h-11 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-500 font-medium mt-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#77c1e6] text-white font-bold 
               hover:bg-[#4b4b4b] transition-colors cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Log in
          </Link>
        </p>
        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            <span className="font-medium">Important:</span> This tool is for
            awareness only, not a medical diagnosis.
          </p>
        </div>
      </div>
    </main>
  );
}
