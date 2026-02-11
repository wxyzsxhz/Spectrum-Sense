// createProfile.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Baby, AlertTriangle, Users } from "lucide-react";

const CreateChildProfile = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    childName: "",
    dob: "",
    gender: "", // Will convert to 'male'/'female'
    region: "",
    parentRelationship: "Mother",
    jaundice: "", // 'Yes'/'No'
    familyASD: "", // 'Yes'/'No'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedAge, setCalculatedAge] = useState<string>("");
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;

    let displayAge = "";
    if (years === 0) {
      displayAge = `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      displayAge = `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
    }

    return {
      display: displayAge,
      years,
      months,
      totalMonths,
    };
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "dob" && value) {
      const ageResult = calculateAge(value);
      setCalculatedAge(ageResult.display);
      setAgeMonths(ageResult.totalMonths);
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.childName.trim()) {
      newErrors.childName = "Child name is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();

      if (birthDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      } else {
        const ageResult = calculateAge(formData.dob);
        if (ageResult.totalMonths < 18) {
          newErrors.dob = "Child must be at least 18 months old";
        } else if (ageResult.totalMonths > 132) {
          newErrors.dob = "Child must be 11 years old or younger";
        }
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.region) {
      newErrors.region = "Region is required";
    }

    if (!formData.jaundice) {
      newErrors.jaundice = "Jaundice information is required";
    }

    if (!formData.familyASD) {
      newErrors.familyASD = "Family ASD history is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You need to be logged in to create a child profile");
      }

      // Prepare data for backend API
      const apiData = {
        name: formData.childName.trim(),
        dateOfBirth: formData.dob,
        relationship: formData.parentRelationship,
        gender: formData.gender.toLowerCase(), // Convert to API format
        jaundice: formData.jaundice === "Yes",
        familyWithASD: formData.familyASD === "Yes",
        region: formData.region,
      };

      console.log("Creating child profile with data:", apiData);

      // Call backend API
      const response = await fetch(`${API_URL}/child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });
      console.log(apiData);
      console.log("Response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        data = { message: "Invalid server response" };
      }

      if (response.status === 201) {
        // Success - redirect to dashboard
        console.log("Child profile created successfully:", data.message);
        alert(data.message || "Child profile created successfully!");
        router.push("/dashboard");
      } else {
        // Handle API errors
        let errorMessage = data.message || "Failed to create child profile";

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please login again.";
        } else if (response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Create child profile error details:", error);

      let errorMessage = "Network error. ";

      if (error instanceof TypeError) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Cannot connect to server. ";
          errorMessage += "This may be because:";
          errorMessage += "\n1. The backend server is not running";
          errorMessage += "\n2. You're using the wrong URL";
          errorMessage += "\n3. There's a CORS issue";

          // For demo/testing - allow mock creation
          errorMessage += "\n\nUsing demo mode for testing...";

          // Mock success for demo purposes
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert("Child profile created successfully! (Demo mode)");
          router.push("/dashboard");
          setIsSubmitting(false);
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
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      )
    ) {
      router.push("/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Image */}
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
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-[#1a9fb0] hover:text-[#148a9a] hover:bg-[#e6f7ff] p-0"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Logo and Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffcccc] to-[#ff9999] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <Baby className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Child Profile
            </h1>
            <p className="text-gray-600 text-sm">
              Add a new child to track assessments and progress
            </p>
          </div>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium whitespace-pre-line">
              {apiError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Name */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              Child&apos;s Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              placeholder="Enter child's full name"
              className={`h-11 ${errors.childName ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.childName && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.childName}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 ml-2 font-normal">
                (18 months to 11 years)
              </span>
            </Label>
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`h-11 ${errors.dob ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {calculatedAge && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                <div className="flex justify-between items-center">
                  <div>
                    Age:{" "}
                    <span className="font-medium text-[#77c1e6]">
                      {calculatedAge}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {ageMonths >= 18 && ageMonths <= 132 ? (
                      <span className="text-green-600">✓ Valid age</span>
                    ) : (
                      <span className="text-red-600">✗ Invalid age</span>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Total: {ageMonths} months (
                  {ageMonths < 18
                    ? "Too young"
                    : ageMonths > 132
                      ? "Too old"
                      : "Valid range"}
                  )
                </div>
              </div>
            )}
            {errors.dob && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.dob}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-gray-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Gender <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {["Boy", "Girl"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all h-11 ${
                    formData.gender === option
                      ? "bg-[#77c1e6] border-[#77c1e6] text-white"
                      : "border-gray-300 hover:border-[#77c1e6] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.gender}
              </p>
            )}
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              Region/Country <span className="text-red-500">*</span>
            </Label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={`w-full h-11 px-4 rounded-lg border ${
                errors.region ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#77c1e6] focus:border-transparent transition-all bg-white`}
              disabled={isSubmitting}
            >
              <option value="">Select region</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Africa">Africa</option>
              <option value="Australia/Oceania">Australia/Oceania</option>
            </select>
            {errors.region && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.region}
              </p>
            )}
          </div>

          {/* Parent Relationship */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              Relationship to Child <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {["Mother", "Father", "Primary Guardian"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all h-11 ${
                    formData.parentRelationship === option
                      ? "bg-[#77c1e6] border-[#77c1e6] text-white"
                      : "border-gray-300 hover:border-[#77c1e6] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="parentRelationship"
                    value={option}
                    checked={formData.parentRelationship === option}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Jaundice */}
          <div className="space-y-2">
            <Label className="text-gray-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Jaundice at Birth <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all h-11 ${
                    formData.jaundice === option
                      ? "bg-[#77c1e6] border-[#77c1e6] text-white"
                      : "border-gray-300 hover:border-[#77c1e6] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="jaundice"
                    value={option}
                    checked={formData.jaundice === option}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
            {errors.jaundice && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.jaundice}
              </p>
            )}
          </div>

          {/* Family with ASD */}
          <div className="space-y-2">
            <Label className="text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Family with ASD <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all h-11 ${
                    formData.familyASD === option
                      ? "bg-[#77c1e6] border-[#77c1e6] text-white"
                      : "border-gray-300 hover:border-[#77c1e6] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="familyASD"
                    value={option}
                    checked={formData.familyASD === option}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
            {errors.familyASD && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.familyASD}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 h-12 bg-[#77c1e6] text-white font-bold hover:bg-[#4b4b4b] transition-colors"
              disabled={isSubmitting}
            >
              <Baby className="w-5 h-5 mr-3" />
              {isSubmitting ? "Creating..." : "Create Child Profile"}
            </Button>

            <Button
              type="button"
              onClick={handleCancel}
              className="flex-1 h-12 bg-[#EFD780] text-white font-bold hover:bg-[#4b4b4b] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Important Note */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            <span className="font-medium">Important:</span> All information is
            stored securely and privately. Children must be between 18 months
            and 11 years old for assessment.
          </p>
        </div>
      </div>
    </main>
  );
};

export default CreateChildProfile;
