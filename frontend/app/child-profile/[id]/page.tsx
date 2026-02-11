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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const ChildProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;

  // Initial child data
  const initialChildData = {
    id: childId,
    name: `Child ${String.fromCharCode(64 + parseInt(childId))}`,
    age: childId === "1" ? 1 : childId === "2" ? 6 : 5, // Years
    dob:
      childId === "1"
        ? "2024-02-05"
        : childId === "2"
          ? "2018-07-22"
          : "2019-11-30",
    gender: childId === "2" ? "Girl" : "Boy",
    region:
      childId === "1" ? "North America" : childId === "2" ? "Europe" : "Asia",
    parentName: "Jane Doe",
    parentRelationship: "Mother",
    lastAssessment: "2 weeks ago",
    totalAssessments: 3,
    nextAssessmentDue: "In 2 months",
    createdAt: "March 15, 2023",
  };

  // State for child data and edit mode
  const [childData, setChildData] = useState(initialChildData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialChildData);
  const [ageMonths, setAgeMonths] = useState<number>(0);

  // Calculate age in months on component mount and when dob changes
  useEffect(() => {
    const calculateAgeMonths = (dob: string) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      return years * 12 + months;
    };

    setAgeMonths(calculateAgeMonths(childData.dob));
  }, [childData.dob]);

  // Updated assessment history with new columns
  const [assessmentHistory] = useState([
    {
      id: 1,
      date: "2024-01-15",
      time: "14:45",
      level: 1,
      riskLabel: "Low",
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-11-20",
      time: "10:30",
      level: 2,
      riskLabel: "Low",
      status: "Completed",
    },
    {
      id: 3,
      date: "2023-09-10",
      time: "16:15",
      level: 3,
      riskLabel: "Low",
      status: "Completed",
    },
  ]);

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${childData.name}'s profile? This action cannot be undone.`,
      )
    ) {
      // In real app, make API call to delete
      // For now, we'll simulate deletion and redirect
      console.log(`Deleting child profile: ${childData.name}`);
      alert(`${childData.name}'s profile has been deleted.`);
      router.push("/dashboard");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(childData);
  };

  const handleSave = () => {
    // Validate form
    if (!editForm.name.trim()) {
      alert("Child name is required");
      return;
    }

    // In real app, make API call to update
    setChildData(editForm);
    setIsEditing(false);

    // Show success message
    alert("Profile updated successfully!");
    console.log("Updated child data:", editForm);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(childData);
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
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    return `${formatDate(dateString)}, ${formatTime(timeString)}`;
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
    }
  };

  const getRiskInfo = (level: number) => {
    switch (level) {
      case 1:
        return { label: "Low", color: "text-green-600" };
      case 2:
        return { label: "Medium", color: "text-yellow-600" };
      case 3:
        return { label: "High", color: "text-red-600" };
      default:
        return { label: "Unknown", color: "text-muted-foreground" };
    }
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

  // Function to get assessment link based on age
  const getAssessmentLink = () => {
    return `/assessment?child=${childId}&ageMonths=${ageMonths}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-white">
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
                      Child&apos;s Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="bg-white border-[#ffcccc]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-[#cc3333] mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        name="dob"
                        value={editForm.dob}
                        onChange={handleEditChange}
                        max={new Date().toISOString().split("T")[0]}
                        className="bg-white border-[#ffcccc]"
                      />
                      {editForm.dob && (
                        <p className="text-xs text-gray-500 mt-1">
                          Age: {calculateAge(editForm.dob)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-[#cc3333] mb-2">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Boy", "Girl"].map((option) => (
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
                            <span className="font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-[#cc3333] mb-2">
                      Region <span className="text-red-500">*</span>
                    </Label>
                    <select
                      name="region"
                      value={editForm.region}
                      onChange={handleEditChange}
                      className="w-full h-11 px-4 rounded-lg border border-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ffcccc] bg-white"
                    >
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
                </div>
              ) : (
                /* Child Info - View Mode */
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-[#cc3333] mb-2">
                    {childData.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {calculateAge(childData.dob)} old
                    {ageMonths && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({ageMonths} months)
                      </span>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                      <Calendar className="w-4 h-4 text-[#cc3333]" />
                      <span className="text-sm text-gray-700">
                        DOB: {formatDate(childData.dob)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                      <User className="w-4 h-4 text-[#cc3333]" />
                      <span className="text-sm text-gray-700">
                        {childData.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#ffcccc]">
                      <MapPin className="w-4 h-4 text-[#cc3333]" />
                      <span className="text-sm text-gray-700">
                        {childData.region}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
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
                      {/* FIXED: Pass ageMonths to assessment page */}
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
                      onClick={handleDelete}
                      className="border-[#e1e8f0] text-gray-600 hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Profile
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
                      {childData.parentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relationship</p>
                    <p className="font-medium text-[#1a3a5f]">
                      {childData.parentRelationship}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Profile Created</p>
                    <p className="font-medium text-[#1a3a5f]">
                      {childData.createdAt}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Email</p>
                    <p className="font-medium text-[#1a3a5f]">
                      janedoe@email.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment History */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e1e8f0] p-6">
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
                    {/* FIXED: Pass ageMonths to assessment page */}
                    <Link href={getAssessmentLink()}>
                      Start First Assessment
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#e1e8f0] text-[#1a9fb0]">
                        <th className="py-3 px-4 text-left text-sm font-semibold w-[50px]">
                          No
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold">
                          Risk
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold">
                          Date & Time
                        </th>
                        <th className="py-3 px-4 text-right text-sm font-semibold">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...assessmentHistory]
                        .sort(
                          (a, b) =>
                            new Date(`${b.date}T${b.time}`).getTime() -
                            new Date(`${a.date}T${a.time}`).getTime(),
                        )
                        .map((assessment, index) => (
                          <tr
                            key={assessment.id}
                            className="border-b border-[#e1e8f0] hover:bg-[#e6f7ff] transition text-[#4b4b4b]"
                          >
                            {/* No */}
                            <td className="py-3 px-4 text-sm">{index + 1}</td>

                            {/* ✅ Risk (FIXED) */}
                            <td className="py-3 px-4 text-sm font-semibold">
                              <span
                                className={getRiskColor(
                                  getRiskInfo(assessment.level).label,
                                )}
                              >
                                {getRiskInfo(assessment.level).label}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-3 px-4 text-sm">
                              {formatDateTime(assessment.date, assessment.time)}
                            </td>

                            {/* ✅ Details (FIXED) */}
                            <td className="py-3 px-4 text-sm text-right">
                              <Link
                                href={`/article/level-${assessment.level}`}
                                className="inline-flex items-center gap-1 text-sm hover:underline"
                              >
                                View
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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
                    {childData.totalAssessments}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Assessment</p>
                  <p className="text-lg font-medium text-[#1a3a5f] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {childData.lastAssessment}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Due</p>
                  <p className="text-lg font-medium text-[#1a3a5f]">
                    {childData.nextAssessmentDue}
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
                {/* FIXED: Pass ageMonths to assessment page */}
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
};

export default ChildProfilePage;
