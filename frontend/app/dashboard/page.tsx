"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  User,
  Mail,
  Calendar,
  Baby,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChildCard } from "@/components/ChildCard";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/components/ui/simple-toast";

// Custom Alert Dialog Component (same as in child profile)
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
  age: number;
  gender?: string;
  region?: string;
}

interface UserData {
  name: string;
  email: string;
}

// Main Dashboard Content
function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch user data and children on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchUserData(),
      fetchChildren(),
      fetchTotalAssessments(),
    ]);
    setIsLoading(false);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      // If no token, redirect to login
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

      console.log("Account response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Account response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        data = { message: "Invalid server response" };
      }

      if (response.status === 200) {
        // Success - store user data
        setUserData(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // Handle API errors
        let errorMessage = data.message || "Failed to load user data";

        if (response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        } else if (response.status === 404) {
          errorMessage = "User not found.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        // For demo purposes, use mock data
        const mockUser = {
          name: "Jane Doe",
          email: "janedoe@email.com",
        };
        setUserData(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      toast({
        title: "Error",
        description: "Failed to fetch user data. Using demo mode.",
        variant: "destructive",
      });

      // Use mock data for demo
      const mockUser = {
        name: "Demo User",
        email: "demo@example.com",
      };
      setUserData(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
  };

  const fetchChildren = async () => {
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Fetching child cards...");

      const response = await fetch(`${API_URL}/child-cards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Fetch response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        data = { message: "Invalid server response", children: [] };
      }

      if (response.status === 200) {
        // Success - set children data
        console.log("Child cards fetched successfully:", data.message);
        setChildren(data.children || []);
      } else {
        // Handle API errors
        let errorMessage = data.message || "Failed to fetch child cards";

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please login again.";
          localStorage.removeItem("token");
          router.push("/login");
          return;
        } else if (response.status === 404) {
          // This is not an error - just no children yet
          setChildren([]);
          // Don't show toast for 404
          console.log(
            "No child profiles found (404) - this is normal for new users",
          );
          return; // Early return to avoid setting error state
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setError(errorMessage);

        // Only show toast for actual errors (not 404)
        if (response.status !== 404) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Fetch child cards error details:", error);

      let errorMessage = "Network error. ";

      if (error instanceof TypeError) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Cannot connect to server. ";
          errorMessage += "This may be because:";
          errorMessage += "\n1. The backend server is not running";
          errorMessage += "\n2. You're using the wrong URL";
          errorMessage += "\n3. There's a CORS issue";

          errorMessage += "\n\nUsing demo mode - showing sample data...";

          const mockChildren = [
            {
              id: "1",
              name: "John Doe",
              age: 5,
              gender: "Boy",
              region: "North America",
            },
            {
              id: "2",
              name: "Jane Smith",
              age: 3,
              gender: "Girl",
              region: "Europe",
            },
            {
              id: "3",
              name: "Alex Johnson",
              age: 7,
              gender: "Boy",
              region: "Asia",
            },
          ];
          setChildren(mockChildren);
          setError("");

          toast({
            title: "Demo Mode",
            description: "Showing sample data. Connect backend for real data.",
            variant: "warning",
          });
        }
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else if (typeof error === "string") {
        errorMessage += error;
      } else {
        errorMessage += "An unknown error occurred.";
      }

      if (!children.length) {
        setError(errorMessage);

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const fetchTotalAssessments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/tests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Parent tests response:", data);

      if (response.ok && Array.isArray(data.children)) {
        // Count total tests across all children
        const total = data.children.reduce(
          (sum: number, child: any) =>
            sum + (Array.isArray(child.tests) ? child.tests.length : 0),
          0,
        );

        setTotalAssessments(total);
      } else {
        setTotalAssessments(0);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setTotalAssessments(0);
    }
  };

  const handleDeleteClick = (child: Child) => {
    setChildToDelete(child);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!childToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/child/${childToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Remove from local state - this triggers re-render
        setChildren((prev) => {
          const updatedChildren = prev.filter(
            (child) => child.id !== childToDelete.id,
          );
          return updatedChildren;
        });

        // Also update total assessments count
        fetchTotalAssessments();

        toast({
          title: "Success",
          description: `${childToDelete.name}'s profile deleted successfully`,
          variant: "success",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to delete child profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting child:", error);
      toast({
        title: "Error",
        description: "Failed to delete child profile",
        variant: "destructive",
      });
    } finally {
      setChildToDelete(null);
    }
  };

  const handleDeleteChild = (id: string) => {
    // Find the child to delete
    const child = children.find((c) => c.id === id);
    if (child) {
      handleDeleteClick(child);
    }
  };

  const scrollToChildrenSection = () => {
    const element = document.getElementById("children-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("highlight-pulse");
      setTimeout(() => {
        element.classList.remove("highlight-pulse");
      }, 1500);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9fb0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-25 px-6 md:px-12 lg:px-20 py-8 bg-gradient-to-b from-[#e6f7ff] to-white">
      {/* Delete Confirmation Dialog */}
      <CustomAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Child Profile"
        description="Are you sure you want to delete this profile?"
        childName={childToDelete?.name}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <style jsx>{`
        @keyframes pulse-highlight {
          0%,
          100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(26, 159, 176, 0.1);
          }
        }
        .highlight-pulse {
          animation: pulse-highlight 1.5s ease-in-out;
          border-radius: 0.75rem;
        }
      `}</style>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#1a3a5f]">
              Parent Dashboard
            </h1>
          </div>
        </div>
        <p className="text-[#666] text-sm">
          Welcome back, {userData?.name || "User"}
        </p>
      </header>

      {/* Error Message - Only show for real errors, not empty state */}
      {error && !children.length && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium whitespace-pre-line">
                {error}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Try refreshing or check if the backend server is running.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Redesigned Parent Info Card */}
      <section className="mb-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e1e8f0]">
          {/* Card Header with Soft Gradient */}
          <div className="bg-gradient-to-r from-[#e6f7ff] to-[#d1f0f6] p-6 text-[#1a3a5f] relative border-b border-[#e1e8f0]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a9fb0] to-[#2ab3c8] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[#1a9fb0] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#2ab3c8]"></div>
                </div>
              </div>

              {/* Parent Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1 text-[#1a3a5f]">
                  {userData?.name || "User Name"}
                </h2>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e1e8f0] shadow-sm">
                    <Mail className="w-4 h-4 text-[#1a9fb0]" />
                    <span className="text-sm text-[#1a3a5f]">
                      {userData?.email || "user@email.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body with Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Total Children Card */}
              <button
                onClick={scrollToChildrenSection}
                className="bg-gradient-to-br from-[#ffe6e6] to-[#ffeded] p-4 rounded-xl border border-[#ffcccc] hover:border-[#ff9999] hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#cc6666] mb-2">
                      Total Children
                    </p>
                    <p className="text-2xl font-bold text-[#cc3333] group-hover:text-[#ff6666] transition-colors">
                      {children.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#ffcccc]/50 group-hover:bg-[#ffcccc]/70 transition-colors flex items-center justify-center">
                    <User className="w-5 h-5 text-[#cc3333] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-[#cc3333] font-medium">
                  <span>Click to view all children</span>
                </div>
              </button>

              {/* Assessments Card */}
              <Link href="/history" className="block">
                <div className="bg-gradient-to-br from-[#e6f7ff] to-[#d1f0f6] p-4 rounded-xl border border-[#b3e0ff] hover:border-[#1a9fb0] hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#1a9fb0] mb-2">Assessments</p>
                      <p className="text-2xl font-bold text-[#1a3a5f] group-hover:text-[#148a9a] transition-colors">
                        {totalAssessments}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#b3e0ff]/50 group-hover:bg-[#b3e0ff]/70 transition-colors flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#1a3a5f] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-[#1a3a5f] font-medium">
                    <span>View assessment history</span>
                  </div>
                </div>
              </Link>

              {/* Last Login Card - Soft Yellow color */}
              <div className="bg-gradient-to-br from-[#fff8e6] to-[#fff5d1] p-4 rounded-xl border border-[#ffe6b3]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#cc9900] mb-2">Last Login</p>
                    <p className="text-2xl font-bold text-[#996600]">Today</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#ffe6b3]/50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#996600]" />
                  </div>
                </div>
                <div className="mt-3 text-sm text-[#cc9900]">
                  <span>Active now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Children Section */}
      <section id="children-section">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffcccc] to-[#ff9999] flex items-center justify-center overflow-hidden shadow-md">
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a3a5f]">
                All Children
              </h2>
              <p className="text-[#666] mt-1">
                Manage and track assessments for each child
              </p>
            </div>
          </div>

          <Button
            asChild
            className="bg-gradient-to-r from-[#1a9fb0] to-[#2ab3c8] text-white hover:opacity-90 font-medium shadow-sm"
          >
            <Link href="/createProfile">
              <Plus className="w-4 h-4 mr-2" />
              Add Child Profile
            </Link>
          </Button>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#e1e8f0]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#e6f7ff] to-[#d1f0f6] flex items-center justify-center">
              <Plus className="w-6 h-6 text-[#1a9fb0]" />
            </div>
            <p className="text-[#4b4b4b] mb-4 text-lg">No child profiles yet</p>
            <p className="text-[#666] mb-6 max-w-md mx-auto">
              Start by adding your first child profile to track assessments and
              monitor their progress.
            </p>
            <Link href="/createProfile">
              <Button className="bg-gradient-to-r from-[#1a9fb0] to-[#2ab3c8] text-white hover:opacity-90 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Child
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                id={child.id}
                name={child.name}
                age={child.age}
                gender={child.gender}
                region={child.region}
                onDelete={handleDeleteChild}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Wrap with ToastProvider
export default function Dashboard() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
