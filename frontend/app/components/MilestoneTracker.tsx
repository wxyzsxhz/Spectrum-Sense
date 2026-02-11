"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Milestone } from "../../data/milestones";
import { ArrowLeft } from "lucide-react";

interface Answer {
  [key: number]: "yes" | "not-yet" | null;
}

interface MilestoneTrackerProps {
  milestone?: Milestone;
  onBack: () => void;
}

/* ================= TONE CONFIG ================= */
const toneConfig = {
  good: {
    text: "text-green-700",
    ring: "#22c55e",
    gradient: "from-green-400 to-green-600",
  },
  neutral: {
    text: "text-yellow-700",
    ring: "#f59e0b",
    gradient: "from-yellow-400 to-yellow-600",
  },
  concern: {
    text: "text-red-700",
    ring: "#ef4444",
    gradient: "from-red-400 to-red-600",
  },
};

/* ================= RING CHART ================= */
const RingChart = ({
  percent,
  color,
}: {
  percent: number;
  color: string;
}) => {
  return (
    <div
      className="relative w-24 h-24 rounded-full"
      style={{
        background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}% 100%)`,
      }}
    >
      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-gray-700">
          {percent}%
        </span>
      </div>
    </div>
  );
};

const MilestoneTracker = ({ milestone, onBack }: MilestoneTrackerProps) => {
  const [answers, setAnswers] = useState<Answer>({});
  const [showResult, setShowResult] = useState(false);

  /* ========== RESET WHEN MILESTONE CHANGES ========== */
  useEffect(() => {
    setAnswers({});
    setShowResult(false);
  }, [milestone?.id]);

  if (!milestone) return null;

  const handleAnswer = (index: number, answer: "yes" | "not-yet") => {
    setAnswers((prev) => ({
      ...prev,
      [index]: prev[index] === answer ? null : answer,
    }));
  };

  const totalQuestions = milestone.questions.length;
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const yesCount = Object.values(answers).filter((a) => a === "yes").length;
  const yesRatio = yesCount / totalQuestions;
  const percentage = Math.round(yesRatio * 100);

  /* ================= RESULT LOGIC ================= */
  const getResult = () => {
    if (yesRatio >= 0.75) {
      return {
        label: "Development appears on track",
        tone: "good" as const,
        message:
          "Your child is meeting most expected milestones for this age. Continue encouraging play, talking, and daily activities.",
      };
    }

    if (yesRatio >= 0.5) {
      return {
        label: "Some milestones still developing",
        tone: "neutral" as const,
        message:
          "Some skills may still be emerging. This is common at this age. Keep observing progress and consider discussing this at your next pediatric visit.",
      };
    }

    return {
      label: "Consider discussing with a professional",
      tone: "concern" as const,
      message:
        "Several milestones are not yet observed. This does not mean something is wrong, but sharing these results with a pediatrician can be helpful.",
    };
  };

  const result =
    answeredCount === totalQuestions ? getResult() : null;

  const toneStyles = result ? toneConfig[result.tone] : null;

  /* ========== SHOW RESULT WHEN DONE ========== */
  useEffect(() => {
    if (answeredCount === totalQuestions && totalQuestions > 0) {
      setShowResult(true);
    }
  }, [answeredCount, totalQuestions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= TRACKER CARD ================= */}
      <div className="rounded-2xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#4b4b4b]/50 hover:text-[#4b4b4b] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">
              Back to all milestones
            </span>
          </button>

          <div className="flex justify-between items-center text-[#1a9fb0]">
            <h1 className="text-lg font-bold">
              {milestone.age} Development Screening
            </h1>

            {answeredCount > 0 && (
              <span className="text-sm font-bold">
                {answeredCount} of {totalQuestions} checked
              </span>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 text-[#4b4b4b]">
          {milestone.questions.map((q, i) => (
            <div
              key={i}
              className="bg-[#2ab3c8]/10 p-4 rounded-xl border border-[#1a9fb0]/20"
            >
              <p className="mb-1 text-sm font-medium text-[#1a9fb0]">
                Milestone {i + 1}
              </p>

              <p className="mb-3">{q}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(i, "yes")}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition",
                    answers[i] === "yes"
                      ? "bg-[#2ab3c8] text-white border-[#2ab3c8]"
                      : "hover:bg-[#2ab3c8]/30"
                  )}
                >
                  ✓ Yes
                </button>

                <button
                  onClick={() => handleAnswer(i, "not-yet")}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition",
                    answers[i] === "not-yet"
                      ? "bg-gray-600 text-white border-gray-600"
                      : "hover:bg-[#4b4b4b]/30"
                  )}
                >
                  Not Yet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= REASSURANCE CARD ================= */}
      <div className="bg-[#2ab3c8]/10 p-4 rounded-xl border border-[#1a9fb0]/20 shadow-card">
        <h3 className="font-bold mb-2 text-[#1a9fb0]">
          🌱 Reassurance for Parents
        </h3>
        <p className="text-sm text-[#4b4b4b]">
          Children develop at different speeds. Selecting “Not Yet” does not
          mean something is wrong. This checklist is only a guide and not a
          diagnosis.
        </p>
      </div>

      {/* ================= FLOATING RESULT TOAST ================= */}
      {showResult && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div
            className={cn(
              "w-[90%] max-w-md rounded-2xl p-6 shadow-xl animate-slide-up text-white bg-gradient-to-br",
              toneStyles?.gradient
            )}
          >
            <h2 className={cn("text-xl font-bold mb-2", toneStyles?.text)}>
              {result.label}
            </h2>

            <p className="text-sm mb-4 opacity-90">
              {result.message}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <RingChart
                percent={percentage}
                color={toneStyles?.ring || "#22c55e"}
              />

              <div>
                <p className={cn("text-lg font-bold", toneStyles?.text)}>
                  {yesCount} / {totalQuestions}
                </p>
                <p className="text-sm opacity-90">
                  milestones achieved
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResult(false)}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowResult(false);
                  onBack();
                }}
                className="px-4 py-2 rounded-lg bg-white text-[#333] hover:bg-[#333] hover:text-white text-sm font-medium"
              >
                Screen another milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;
