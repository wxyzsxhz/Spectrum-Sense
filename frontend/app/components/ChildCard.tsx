"use client";
import Link from "next/link";
import { useState } from "react";
import { MoreVertical, Trash2, User, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChildCardProps {
  id: string;
  name: string;
  age: number;
  gender?: string;
  dob?: string;
  region?: string;
  onDelete: (id: string) => void;
}

export function ChildCard({
  id,
  name,
  age,
  gender,
  dob,
  region,
  onDelete,
}: ChildCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to format months to "X years Y months"
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

  const cardColors = [
    {
      bg: "from-[#ffe6e6] to-[#ffeded]",
      border: "border-[#ffcccc]",
      text: "text-[#cc3333]",
      iconBg: "bg-[#ffcccc]/50",
    },
    {
      bg: "from-[#e6f7ff] to-[#d1f0f6]",
      border: "border-[#b3e0ff]",
      text: "text-[#1a3a5f]",
      iconBg: "bg-[#b3e0ff]/50",
    },
    {
      bg: "from-[#fff8e6] to-[#fff5d1]",
      border: "border-[#ffe6b3]",
      text: "text-[#996600]",
      iconBg: "bg-[#ffe6b3]/50",
    },
    {
      bg: "from-[#e6ffe6] to-[#d1f6d1]",
      border: "border-[#b3ffb3]",
      text: "text-[#336633]",
      iconBg: "bg-[#b3ffb3]/50",
    },
    {
      bg: "from-[#f0e6ff] to-[#e6d1f6]",
      border: "border-[#d9ccff]",
      text: "text-[#663399]",
      iconBg: "bg-[#d9ccff]/50",
    },
    {
      bg: "from-[#ffe6f0] to-[#f6d1e6]",
      border: "border-[#ffccdd]",
      text: "text-[#cc3366]",
      iconBg: "bg-[#ffccdd]/50",
    },
  ];

  const colors = cardColors[parseInt(id) % cardColors.length];

  const handleDeleteClick = () => {
    setShowMenu(false);
    // Just call the parent's onDelete which will show the dialog in Dashboard
    onDelete(id);
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${colors.bg} rounded-xl shadow-sm ${colors.border} border overflow-hidden hover:shadow-md transition-shadow`}
    >
      {/* Profile */}
      <Link href={`/child-profile/${id}`} className="block">
        <div className="p-5 pb-3 flex flex-col items-center text-center cursor-pointer hover:opacity-90 transition-opacity">
          <div className="relative mb-4">
            <div
              className={`w-16 h-16 rounded-full ${colors.iconBg} flex items-center justify-center overflow-hidden border-4 border-white shadow-lg`}
            >
              <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                <Baby className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          </div>

          <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{formatAge(age)}</p>

          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {gender && (
              <span className="px-2 py-1 text-xs bg-white/50 rounded-full text-gray-700">
                {gender}
              </span>
            )}
            {region && (
              <span className="px-2 py-1 text-xs bg-white/50 rounded-full text-gray-700">
                {region}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Take Assessment */}
      <div className="px-5 pb-4">
        <Button
          asChild
          className={`w-full ${colors.text} bg-white/70 hover:bg-white border ${colors.border} font-semibold transition-colors`}
        >
          <Link href={`/assessment?childId=${id}&ageMonths=${age}`}>
            Take Assessment
          </Link>
        </Button>
      </div>

      {/* Menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
          disabled={isDeleting}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {showMenu && !isDeleting && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[120px]">
              <Link
                href={`/child-profile/${id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                <User size={14} />
                View Profile
              </Link>
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#dc2626] hover:bg-[#fef2f2] w-full"
                disabled={isDeleting}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
