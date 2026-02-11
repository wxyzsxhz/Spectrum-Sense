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
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChildCard } from "@/components/ChildCard";
import { useRouter } from "next/navigation";

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

const Dashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch user data and children on component mount
  useEffect(() => {
    fetchUserData();
    fetchChildren();
  }, []);

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
    setIsRefreshing(true);
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
          errorMessage =
            "No child profiles found. Create your first child profile!";
          setChildren([]);
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setError(errorMessage);

        if (response.status === 404) {
          console.log("No child profiles found (404)");
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
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteChild = (id: string) => {
    setChildren((prev) => prev.filter((child) => child.id !== id));
  };

  const handleRefresh = () => {
    fetchChildren();
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

  return (
    <main className="min-h-screen pt-25 px-6 md:px-12 lg:px-20 py-8 bg-gradient-to-b from-[#e6f7ff] to-white">
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a9fb0] to-[#2ab3c8] flex items-center justify-center overflow-hidden shadow-md">
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a5f]">
                Parent Dashboard
              </h1>
              <p className="text-[#666] text-sm">
                Welcome back, {userData?.name || "User"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
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
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e1e8f0] shadow-sm">
                    <Calendar className="w-4 h-4 text-[#1a9fb0]" />
                    <span className="text-sm text-[#1a3a5f]">
                      Member since 2024
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
                        12
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
};

export default Dashboard;
