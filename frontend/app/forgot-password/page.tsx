"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to send reset email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would send a reset password email here
    console.log("Reset password requested for:", email);

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Image matching other pages */}
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

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white/50 backdrop-blur-sm shadow-xl p-8 ml-40 mt-20 mb-10">
        <img
          src="/logo.png"
          alt="Spectrum Sense"
          className="mx-auto mt-0 mb-0 w-15"
        />

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to reset your password
        </p>

        {isSubmitted ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Check Your Email
              </h3>
              <p className="text-green-700 mb-4">
                If an account exists with <strong>{email}</strong>, you will
                receive password reset instructions shortly.
              </p>
              <p className="text-sm text-green-600">
                Please check your inbox and follow the link to reset your
                password.
              </p>
            </div>

            {/* Back to Login Button */}
            <div className="text-center">
              <Link href="/login">
                <Button className="bg-[#77c1e6] text-white font-bold hover:bg-[#4b4b4b] px-6">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Log In
                </Button>
              </Link>
            </div>

            {/* Didn't receive email? */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive an email?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
                <p className="text-sm text-gray-500">
                  Enter the email address associated with your Spectrum Sense
                  account.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#77c1e6] text-white font-bold 
                   hover:bg-[#4b4b4b] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-8">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Log In
              </Link>
            </div>
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
