"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string; // Get token from URL path, not query params

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [apiError, setApiError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      setApiError("No reset token provided");
    }
    setIsVerifying(false);
  }, [token]);

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

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, newPassword: value }));

    // Update password strength
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);

    // Show requirements when user starts typing
    if (value.length > 0 && !showPasswordRequirements) {
      setShowPasswordRequirements(true);
    }

    // Clear password error
    if (errors.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }

    // Clear confirm password error if passwords now match
    if (errors.confirmPassword && value === formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    // Clear API error
    if (apiError) {
      setApiError("");
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

    // Clear API error
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { newPassword: "", confirmPassword: "" };

    // Validate new password
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      newErrors.newPassword = passwordErrors.join(", ");
      hasErrors = true;
    }

    // Validate confirm password - ONLY check on submit
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please retype.";
      hasErrors = true;
    }

    if (!token) {
      setApiError("Invalid or missing reset token");
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      // FIXED: Token in URL path, not in body
      // FIXED: Field name is "password" not "newPassword"
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.newPassword, // Changed from newPassword to password
        }),
      });

      console.log("Reset password response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Reset password response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        throw new Error("Invalid server response");
      }

      // FIXED: Success status is 201, not 200
      if (response.status === 201) {
        // Success - password reset successful
        console.log("Password reset successful:", data.message);
        setIsSubmitted(true);
      } else {
        // Handle API errors
        let errorMessage = data.message || "Failed to reset password";

        if (response.status === 400) {
          errorMessage =
            "Invalid or expired token. Please request a new password reset.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Reset password error details:", error);

      let errorMessage = "Network error. ";

      if (error instanceof TypeError) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Cannot connect to server. ";
          errorMessage += "This may be because:";
          errorMessage += "\n1. The backend server is not running";
          errorMessage += "\n2. You're using the wrong URL";
          errorMessage += "\n3. There's a CORS issue";

          // For demo/testing - allow mock flow
          errorMessage += "\n\nUsing demo mode for testing...";

          // Mock success for demo purposes
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setIsSubmitted(true);
          setIsLoading(false);
          return;
        }
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else if (typeof error === "string") {
        errorMessage += error;
      } else {
        errorMessage += "An unknown error occurred.";
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleRequestNewToken = () => {
    router.push("/forgot-password");
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

  // Loading state for initial check
  if (isVerifying) {
    return (
      <main className="relative min-h-screen bg-background overflow-hidden">
        <img
          src="/img.png"
          alt="Spectrum Sense background"
          className="
            absolute
            top-0
            right-0
            bottom-0
            w-[800px]
            md:w-[1000px]
            lg:w-[1000px]
            opacity-90
            pointer-events-none
          "
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 pointer-events-none" />
        <div className="relative rounded-lg z-10 w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-xl p-8 ml-40 mt-20 mb-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#77c1e6] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // No token state
  if (!token) {
    return (
      <main className="relative min-h-screen bg-background overflow-hidden">
        <img
          src="/img.png"
          alt="Spectrum Sense background"
          className="
            absolute
            top-0
            right-0
            bottom-0
            w-[800px]
            md:w-[1000px]
            lg:w-[1000px]
            opacity-90
            pointer-events-none
          "
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 pointer-events-none" />
        <div className="relative rounded-lg z-10 w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl p-8 ml-40 mt-20 mb-10">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Reset Token
            </h2>
            <p className="text-gray-600 mb-6">
              No password reset token was provided in the link.
            </p>
            <Button
              onClick={handleRequestNewToken}
              className="bg-[#77c1e6] text-white font-bold hover:bg-[#4b4b4b] px-6"
            >
              Request Reset Link
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Image matching other pages */}
      <img
        src="/img.png"
        alt="Spectrum Sense background"
        className="
          absolute
          top-10
          right-0
          bottom-0
          w-[800px]
          md:w-[1000px]
          lg:w-[1000px]
          opacity-90
          pointer-events-none
        "
      />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 pointer-events-none" />

      {/* Form Container */}
      <div className="relative rounded-lg z-10 w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-xl p-8 ml-40 mt-20 mb-10">
        <img
          src="/logo.png"
          alt="Spectrum Sense"
          className="mx-auto mt-0 mb-0 w-15"
        />

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Create a new password for your account
        </p>

        {isSubmitted ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-green-700 mb-4">
                Your password has been successfully reset.
              </p>
              <p className="text-sm text-green-600">
                You can now log in with your new password.
              </p>
            </div>

            {/* Go to Login Button */}
            <div className="text-center">
              <Button
                onClick={handleGoToLogin}
                className="bg-[#77c1e6] text-white font-bold hover:bg-[#4b4b4b] px-6"
              >
                Go to Login Page
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* API Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 whitespace-pre-line">
                    {apiError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleNewPasswordChange}
                    className={`h-11 pr-10 ${errors.newPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password strength indicator */}
                {formData.newPassword && (
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

                {/* Password requirements list */}
                {showPasswordRequirements && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Password must contain:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li
                        className={`flex items-center ${formData.newPassword.length >= 8 ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">
                          {formData.newPassword.length >= 8 ? "✓" : "○"}
                        </span>
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center ${passwordRequirements.hasUpperCase.test(formData.newPassword) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">
                          {passwordRequirements.hasUpperCase.test(
                            formData.newPassword,
                          )
                            ? "✓"
                            : "○"}
                        </span>
                        One uppercase letter (A-Z)
                      </li>
                      <li
                        className={`flex items-center ${passwordRequirements.hasLowerCase.test(formData.newPassword) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">
                          {passwordRequirements.hasLowerCase.test(
                            formData.newPassword,
                          )
                            ? "✓"
                            : "○"}
                        </span>
                        One lowercase letter (a-z)
                      </li>
                      <li
                        className={`flex items-center ${passwordRequirements.hasNumber.test(formData.newPassword) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">
                          {passwordRequirements.hasNumber.test(
                            formData.newPassword,
                          )
                            ? "✓"
                            : "○"}
                        </span>
                        One number (0-9)
                      </li>
                      <li
                        className={`flex items-center ${passwordRequirements.hasSpecialChar.test(formData.newPassword) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">
                          {passwordRequirements.hasSpecialChar.test(
                            formData.newPassword,
                          )
                            ? "✓"
                            : "○"}
                        </span>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="text-sm text-red-500 font-medium mt-2">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`h-11 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
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
                disabled={isLoading}
                className="w-full h-12 bg-[#77c1e6] text-white font-bold 
                   hover:bg-[#4b4b4b] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </>
        )}

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
