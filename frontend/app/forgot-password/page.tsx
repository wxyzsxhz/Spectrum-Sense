"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      // ✅ FIXED: Use response.ok instead of status === 201
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        let errorMessage = data.message || "Failed to send reset email";

        if (response.status === 404) {
          errorMessage = `There's no account for ${email}`;
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setError(errorMessage);
      }
    } catch (err) {
      let errorMessage = "Network error. ";

      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        errorMessage +=
          "Cannot connect to server. Please make sure backend is running.";
      } else if (err instanceof Error) {
        errorMessage += err.message;
      } else {
        errorMessage += "Something went wrong.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setError("");
    setEmail("");
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <img
        src="/img.png"
        alt="Spectrum Sense background"
        className="absolute top-10 right-0 bottom-0 w-[800px] md:w-[1100px] lg:w-[1100px] opacity-90 pointer-events-none"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 pointer-events-none" />

      <div className="relative rounded-lg z-10 w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-xl p-8 ml-40 mt-20 mb-10">
        <img
          src="/logo.png"
          alt="Spectrum Sense"
          className="mx-auto mb-4 w-15"
        />

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to reset your password
        </p>

        {/* ✅ Success Message */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Reset email sent successfully!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Please check <span className="font-medium">{email}</span> for
                  password reset instructions.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Didn't receive it?{" "}
                  <button
                    onClick={handleTryAgain}
                    className="text-green-700 hover:text-green-800 hover:underline font-medium"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ❌ Error Message */}
        {error && !isSubmitted && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium whitespace-pre-line">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Email Address</Label>
            <Input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={handleEmailChange}
              className={`h-11 ${
                error ? "border-red-500" : ""
              } ${isSubmitted ? "bg-gray-100 text-gray-600" : ""}`}
              disabled={isLoading || isSubmitted}
              readOnly={isSubmitted}
            />
            <p className="text-sm text-gray-500">
              Enter the email address associated with your Spectrum Sense
              account.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSubmitted}
            className="w-full h-12 bg-[#77c1e6] text-white font-bold hover:bg-[#4b4b4b] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Sending..."
              : isSubmitted
                ? "Email Sent"
                : "Send Reset Instructions"}
          </Button>
        </form>

        <div className="text-center mt-8">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Log In
          </Link>
        </div>

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
