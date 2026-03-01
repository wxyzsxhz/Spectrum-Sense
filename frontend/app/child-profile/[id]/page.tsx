"use client";
import { useParams, useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Baby,
  Calendar,
  MapPin,
  User,
  Edit,
  BookOpen,
  Trash2,
  Clock,
  FileText,
  Save,
  X,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Simple toast provider (create this file if you haven't already)
import { ToastProvider, useToast } from "@/components/ui/simple-toast";

// Custom Alert Dialog Component with matching UI
function CustomAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  childName = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  childName?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content - Smaller size */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Decorative header gradient - thinner */}
        <div className="h-1.5 bg-gradient-to-r from-[#ff9999] to-[#ff6666]" />

        {/* Content - reduced padding */}
        <div className="p-5">
          {/* Warning Icon - smaller */}
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          {/* Title - smaller text */}
          <h2 className="text-lg font-bold text-center text-[#cc3333] mb-1">
            {title}
          </h2>

          {/* Description - smaller text */}
          <p className="text-sm text-gray-600 text-center mb-2">
            {description}
          </p>

          {/* Child name highlight - more compact */}
          {childName && (
            <p className="text-center font-medium text-sm text-[#1a3a5f] bg-[#e6f7ff] py-1.5 px-3 rounded-lg mb-3">
              "{childName}"
            </p>
          )}

          {/* Warning message - smaller */}
          <p className="text-xs text-red-500 text-center mb-4 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            This action cannot be undone
          </p>

          {/* Action Buttons - more compact */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-9 text-sm"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 h-9 text-sm"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Child {
  id: string;
  name: string;
  age: number; // This comes as months from backend
  gender: string;
  relationship: string;
  jaundice: boolean | string;
  familyWithASD: boolean | string;
  region: string;
  createdAt: string;
  dateOfBirth?: string;
  hasASD?: number | null;
}

interface UserData {
  name: string;
  email: string;
}

// Age formatting function - takes months directly
const formatAge = (months: number): string => {
  if (months < 0) return "Invalid age";
  if (months === 0) return "Newborn";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} month${months !== 1 ? "s" : ""} old`;
  }

  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? "s" : ""} old`;
  }

  return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""} old`;
};

// Main component content
function ChildProfileContent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const childId = params.id as string;

  // State for child data and edit mode
  const [childData, setChildData] = useState<Child | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Child>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Age validation states
  const [editCalculatedAge, setEditCalculatedAge] = useState<string>("");
  const [editAgeMonths, setEditAgeMonths] = useState<number>(0);
  const [editAgeError, setEditAgeError] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Age calculation function
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

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Get YYYY-MM-DD part
  };

  // Handle date of birth change in edit mode
  const handleEditDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "dateOfBirth" && value) {
      const ageResult = calculateAge(value);
      setEditCalculatedAge(ageResult.display);
      setEditAgeMonths(ageResult.totalMonths);

      // Validate age
      if (ageResult.totalMonths < 18) {
        setEditAgeError("Child must be at least 18 months old");
      } else if (ageResult.totalMonths > 132) {
        setEditAgeError("Child must be 11 years old or younger");
      } else {
        setEditAgeError("");
      }
    }
  };

  // Fetch child data and user info on component mount
  useEffect(() => {
    fetchChildData();
    fetchUserData();
  }, [childId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Check if we have cached user data
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUserData(JSON.parse(cachedUser));
        return;
      }

      console.log("Fetching user account data...");

      const response = await fetch(`${API_URL}/account`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserData(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  };

  const fetchChildData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      console.log(`Fetching child data for ID: ${childId}`);

      const response = await fetch(`${API_URL}/child/${childId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Child response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Child response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        throw new Error("Invalid server response");
      }

      if (response.status === 200) {
        // Success - set child data
        setChildData(data.child);
        setEditForm(data.child);
      } else {
        // Handle API errors
        let errorMessage = data.message || "Failed to load child data";

        if (response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        } else if (response.status === 404) {
          errorMessage = "Child profile not found.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching child data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load child profile";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Assessment history state (to be fetched from a separate API)
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      fetchAssessmentHistory();
    }
  }, [childId]);

  const fetchAssessmentHistory = async () => {
    try {
      setHistoryLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/tests/${childId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        // Sort newest first
        const sortedTests = data.tests.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setAssessmentHistory(sortedTests);
      } else {
        console.error(data.message);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch assessment history",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch assessment history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assessment history",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      console.log(`Deleting child profile: ${childId}`);

      const response = await fetch(`${API_URL}/child/${childId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Delete response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
      }

      if (response.status === 200) {
        toast({
          title: "Success",
          description: data?.message || "Child profile deleted successfully",
          variant: "success",
        });
        router.push("/dashboard");
      } else {
        let errorMessage = data?.message || "Failed to delete child profile";

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please login again.";
          localStorage.removeItem("token");
          router.push("/login");
          return;
        } else if (response.status === 404) {
          errorMessage = "Child profile not found.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete profile";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deleting profile:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(childData || {});

    // If there's a date of birth, calculate and display age
    if (childData?.dateOfBirth) {
      const ageResult = calculateAge(childData.dateOfBirth);
      setEditCalculatedAge(ageResult.display);
      setEditAgeMonths(ageResult.totalMonths);

      // Validate age
      if (ageResult.totalMonths < 18) {
        setEditAgeError("Child must be at least 18 months old");
      } else if (ageResult.totalMonths > 132) {
        setEditAgeError("Child must be 11 years old or younger");
      } else {
        setEditAgeError("");
      }
    } else {
      setEditCalculatedAge("");
      setEditAgeMonths(0);
      setEditAgeError("");
    }
  };

  const handleSave = async () => {
    // Validate form
    if (!editForm.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Child name is required",
        variant: "destructive",
      });
      return;
    }

    // Validate age if date of birth is being updated
    if (editForm.dateOfBirth) {
      const ageResult = calculateAge(editForm.dateOfBirth);
      if (ageResult.totalMonths < 18) {
        toast({
          title: "Invalid Age",
          description:
            "Child must be at least 18 months old to use this application.",
          variant: "destructive",
        });
        return;
      } else if (ageResult.totalMonths > 132) {
        toast({
          title: "Invalid Age",
          description:
            "Child must be 11 years old or younger to use this application.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      // Prepare update data (only send fields that can be updated)
      const updateData: any = {};

      if (editForm.name !== childData?.name) updateData.name = editForm.name;
      if (editForm.dateOfBirth !== childData?.dateOfBirth)
        updateData.dateOfBirth = editForm.dateOfBirth;
      if (editForm.gender !== childData?.gender)
        updateData.gender = editForm.gender;
      if (editForm.region !== childData?.region)
        updateData.region = editForm.region;
      if (editForm.relationship !== childData?.relationship)
        updateData.relationship = editForm.relationship;

      // Handle ASD Status
      if (editForm.hasASD !== childData?.hasASD) {
        updateData.hasASD = editForm.hasASD ?? null;
      }
      // Handle boolean fields
      if (editForm.jaundice !== childData?.jaundice) {
        updateData.jaundice =
          editForm.jaundice === "true" || editForm.jaundice === true;
      }
      if (editForm.familyWithASD !== childData?.familyWithASD) {
        updateData.familyWithASD =
          editForm.familyWithASD === "true" || editForm.familyWithASD === true;
      }

      // If no fields to update, just exit
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        toast({
          title: "No Changes",
          description: "No changes were made to the profile",
        });
        return;
      }

      console.log("Updating child profile:", updateData);

      const response = await fetch(`${API_URL}/child/${childId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      console.log("Update response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Update response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
      }

      if (response.status === 201 || response.status === 200) {
        // Success - update local state
        setChildData(data.child || { ...childData, ...updateData });
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
          variant: "success",
        });

        // Refresh child data to get latest
        fetchChildData();
      } else {
        let errorMessage = data?.message || "Failed to update child profile";

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please login again.";
          localStorage.removeItem("token");
          router.push("/login");
          return;
        } else if (response.status === 404) {
          errorMessage = "Child profile not found.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(childData || {});
    setEditCalculatedAge("");
    setEditAgeMonths(0);
    setEditAgeError("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  // Function to get assessment link based on age (age already in months from backend)
  const getAssessmentLink = () => {
    return `/assessment?childId=${childId}&ageMonths=${childData?.age || 0}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9fb0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !childData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-white">
        <div className="pt-25 px-6 md:px-12 lg:px-20 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-[#1a9fb0] hover:text-[#148a9a] hover:bg-[#e6f7ff] mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "Failed to load child profile"}
            </p>
            <Button
              onClick={() => {
                setIsLoading(true);
                fetchChildData();
              }}
              className="bg-gradient-to-r from-[#1a9fb0] to-[#2ab3c8] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-white">
      {/* Delete Confirmation Dialog */}
      <CustomAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Child Profile"
        description="Are you sure you want to delete this profile?"
        childName={childData?.name}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Back Button */}
      <div className="pt-25 px-6 md:px-12 lg:px-20 py-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-[#1a9fb0] hover:text-[#148a9a] hover:bg-[#e6f7ff]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 lg:px-20 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e1e8f0] mb-8">
          <div className="bg-gradient-to-r from-[#ffe6e6] to-[#ffeded] p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#ff9999] to-[#ffcccc] flex items-center justify-center overflow-hidden border-6 border-white shadow-2xl">
                  <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                    <Baby className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white border-3 border-white flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Child Info - Edit Mode */}
              {isEditing ? (
                <div className="flex-1 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-[#cc3333] mb-2">
                      Child&apos;s Name <span className="text-green-500">*</span>
                    </Label>
                    <Input
                      name="name"
                      value={editForm.name || ""}
                      onChange={handleEditChange}
                      className="bg-white border-[#ffcccc]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-[#cc3333] mb-0">
                        Date of Birth
                        <span className="block text-xs text-gray-500 font-normal mt-0 mb-1">
                          (18 months to 11 years)
                        </span>
                      </Label>
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formatDateForInput(editForm.dateOfBirth)}
                        onChange={handleEditDateChange}
                        max={new Date().toISOString().split("T")[0]}
                        className={`bg-white ${editAgeError ? "border-red-500" : "border-[#ffcccc]"}`}
                      />

                      {/* Age Display for Edit Mode */}
                      {editCalculatedAge && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200 mt-2">
                          <div className="flex justify-between items-center">
                            <div>
                              Age:{" "}
                              <span className="font-medium text-[#77c1e6]">
                                {editCalculatedAge}
                              </span>
                            </div>
                            <div className="text-gray-500">
                              {editAgeMonths >= 18 && editAgeMonths <= 132 ? (
                                <span className="text-green-600">
                                  ✓ Valid age
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  ✗ Invalid age
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Total: {editAgeMonths} months (
                            {editAgeMonths < 18
                              ? "Too young"
                              : editAgeMonths > 132
                                ? "Too old"
                                : "Valid range"}
                            )
                          </div>
                        </div>
                      )}

                      {editAgeError && (
                        <p className="text-sm text-red-500 font-medium mt-1">
                          {editAgeError}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <Label className="text-sm font-medium text-[#cc3333] mb-2">
                        Gender
                      </Label>
                      <div className="grid grid-cols-2 gap-5 mt-1">
                        {["boy", "girl"].map((option) => (
                          <label
                            key={option}
                            className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer ${
                              editForm.gender === option
                                ? "bg-[#ffcccc] border-[#ff9999] text-white"
                                : "border-gray-300 hover:border-[#ffcccc] bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={editForm.gender === option}
                              onChange={handleEditChange}
                              className="sr-only"
                            />
                            <span className="font-medium capitalize">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-[#cc3333] mb-2">
                      Region
                    </Label>
                    <select
                      name="region"
                      value={editForm.region || ""}
                      onChange={handleEditChange}
                      className="w-full h-11 px-4 rounded-lg border border-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ffcccc] bg-white"
                    >
                      <option value="">Select Region</option>
                      <option value="North America">North America</option>
                      <option value="South America">South America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Africa">Africa</option>
                      <option value="Australia/Oceania">
                        Australia/Oceania
                      </option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-[#cc3333] mb-2">
                      ASD Diagnosis Status
                    </Label>
                    <select
                      name="hasASD"
                      value={
                        editForm.hasASD === null ||
                        editForm.hasASD === undefined
                          ? ""
                          : String(editForm.hasASD)
                      }
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          hasASD:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                      className="w-full h-11 px-4 rounded-lg border border-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ffcccc] bg-white"
                    >
                      <option value="">Not specified</option>
                      <option value="1">Positive</option>
                      <option value="2">Negative</option>
                    </select>
                    <p className="text-sm text-red-500 mt-1">
                      Please indicate if your child has been professionally
                      diagnosed with ASD. This information helps us improve our
                      assessment accuracy and is used for research and training
                      purposes only. Your response is optional and confidential.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-[#cc3333] mb-2">
                        Jaundice History
                      </Label>
                      <select
                        name="jaundice"
                        value={String(editForm.jaundice) || ""}
                        onChange={handleEditChange}
                        className="w-full h-11 px-4 rounded-lg border border-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ffcccc] bg-white"
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-[#cc3333] mb-2">
                        Family Member with ASD
                      </Label>
                      <select
                        name="familyWithASD"
                        value={String(editForm.familyWithASD) || ""}
                        onChange={handleEditChange}
                        className="w-full h-11 px-4 rounded-lg border border-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ffcccc] bg-white"
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* Child Info - View Mode */
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-[#cc3333] mb-2">
                    {childData.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {formatAge(childData.age)}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                      <User className="w-4 h-4 text-[#cc3333]" />
                      <span className="text-sm text-gray-700 capitalize">
                        {childData.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                      <MapPin className="w-4 h-4 text-[#cc3333]" />
                      <span className="text-sm text-gray-700">
                        {childData.region || "Not specified"}
                      </span>
                    </div>

                    {childData.jaundice !== undefined && (
                      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                        <span className="text-sm text-gray-700">
                          Jaundice: {childData.jaundice ? "Yes" : "No"}
                        </span>
                      </div>
                    )}

                    {childData.familyWithASD !== undefined && (
                      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                        <span className="text-sm text-gray-700">
                          Family ASD: {childData.familyWithASD ? "Yes" : "No"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                      <span className="text-sm">
                        ASD Status:{" "}
                        <span
                          className={
                            childData.hasASD === 1
                              ? "font-semibold text-red-500"
                              : childData.hasASD === 2
                                ? "font-semibold text-[#2ab3c8]"
                                : "font-medium text-gray-500"
                          }
                        >
                          {childData.hasASD === 1
                            ? "Positive"
                            : childData.hasASD === 2
                              ? "Negative"
                              : "Not specified"}
                        </span>
                      </span>
                    </div>

                    {childData.dateOfBirth && (
                      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                        <Calendar className="w-4 h-4 text-[#cc3333]" />
                        <span className="text-sm text-gray-700">
                          DOB: {formatDate(childData.dateOfBirth)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !!editAgeError}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#1a9fb0] to-[#2ab3c8] text-white hover:opacity-90"
                    >
                      <Link href={getAssessmentLink()}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        New Assessment
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleEdit}
                      className="border-[#ff9999] text-[#cc3333] hover:bg-[#ffe6e6]"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isDeleting}
                      className="border-[#e1e8f0] text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Profile
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Parent Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Parent Information */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e1e8f0] p-6">
              <h2 className="text-xl font-semibold text-[#1a3a5f] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Parent/Guardian Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-[#1a3a5f]">
                      {userData?.name || "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Relationship to Child
                    </p>
                    <p className="font-medium text-[#1a3a5f]">
                      {childData.relationship || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Profile Created</p>
                    <p className="font-medium text-[#1a3a5f]">
                      {childData.createdAt
                        ? formatDate(childData.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Email</p>
                    <p className="font-medium text-[#1a3a5f]">
                      {userData?.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment History */}
            <div className="rounded-xl shadow-sm border border-[#e1e8f0] p-6">
              <h2 className="text-xl font-semibold text-[#1a3a5f] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Assessment History
              </h2>

              {assessmentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No assessments completed yet
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#1a9fb0] to-[#2ab3c8] text-white hover:opacity-90"
                  >
                    <Link href={getAssessmentLink()}>
                      Start First Assessment
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-[#e1e8f0]">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full bg-white border-collapse">
                      <thead className="bg-[#f5f8fa] sticky top-0">
                        <tr className="border-b border-[#e1e8f0] text-[#1a9fb0]">
                          <th className="py-3 px-4 text-left text-sm font-semibold w-[50px]">
                            No
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold">
                            Risk
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold">
                            Date & Time
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold">
                            Details
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {historyLoading ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : assessmentHistory.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-6 text-center text-gray-500"
                            >
                              No assessments completed yet
                            </td>
                          </tr>
                        ) : (
                          assessmentHistory.map((test, index) => (
                            <tr
                              key={test._id}
                              className="border-b border-[#e1e8f0] hover:bg-[#e6f7ff] transition text-[#4b4b4b]"
                            >
                              <td className="py-3 px-4 text-sm">{index + 1}</td>

                              <td className="py-3 px-4 text-center text-sm font-semibold">
                                <span
                                  className={getRiskColor(
                                    test.risk_category.replace(" Risk", ""),
                                  )}
                                >
                                  {test.risk_category.replace(" Risk", "")}
                                </span>
                                <div className="text-xs text-gray-500">
                                  {test.risk_percentage}%
                                </div>
                              </td>

                              <td className="py-3 px-4 text-center text-sm">
                                {new Date(test.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </td>

                              <td className="py-3 px-4 text-sm text-center">
                                <Link
                                  href={`/result?resultId=${test._id}`}
                                  className="inline-flex items-center gap-1 text-sm hover:underline"
                                >
                                  View
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-[#e6f7ff] to-[#d1f0f6] rounded-xl border border-[#b3e0ff] p-6">
              <h2 className="text-xl font-semibold text-[#1a3a5f] mb-6">
                Assessment Stats
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Assessments
                  </p>
                  <p className="text-3xl font-bold text-[#1a3a5f]">
                    {assessmentHistory.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Assessment</p>
                  <p className="text-lg font-medium text-[#1a3a5f] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {assessmentHistory.length > 0
                      ? new Date(
                          assessmentHistory[0].createdAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "No assessments yet"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Age</p>
                  <p className="text-lg font-medium text-[#1a3a5f]">
                    {formatAge(childData.age)}
                  </p>
                </div>
              </div>
            </div>

            {/* New Assessment Button Card */}
            <div className="bg-gradient-to-br from-[#fff8e6] to-[#fff5d1] rounded-xl border border-[#ffe6b3] p-6">
              <h2 className="text-xl font-semibold text-[#996600] mb-4">
                Quick Action
              </h2>
              <Button
                asChild
                className="w-full h-12 bg-white text-[#996600] hover:bg-white/90 border border-[#ffe6b3] text-base"
              >
                <Link href={getAssessmentLink()}>
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start New Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrap with ToastProvider
export default function ChildProfilePage() {
  return (
    <ToastProvider>
      <ChildProfileContent />
    </ToastProvider>
  );
}
