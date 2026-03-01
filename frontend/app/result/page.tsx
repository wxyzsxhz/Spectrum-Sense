"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PolarAreaChart from "@/components/PolarAreaChart";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

/* ------------------ Colors ------------------ */

const categoryColors: string[] = [
  "#FF8FAB",
  "#52BFFF",
  "#7DD87D",
  "#FFD54F",
  "#C084FC",
];

const MAX_SCORE = 100;

/* ------------------ Page ------------------ */

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<any>(null);
  const resultId = searchParams.get("resultId");

  /* ------------------ Fetch Backend Result ------------------ */

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // 1️⃣ If result passed directly (after assessment)
        const resultParam = searchParams.get("result");
        if (resultParam) {
          const parsed = JSON.parse(decodeURIComponent(resultParam));
          setResult(parsed.result ?? parsed);
          return;
        }

        // 2️⃣ If coming from history (resultId)
        if (resultId) {
          const token = localStorage.getItem("token");

          const res = await fetch(
            `http://localhost:8000/test/${resultId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          if (!res.ok) {
            console.error("Error:", data.message);
            return;
          }

          console.log("Fetched test:", data); // 🔎 DEBUG

          // ✅ IMPORTANT: backend returns { message, test }
          setResult({
            ...data.test,
            percentPerCategory:
              data.test.percentPerCategory ??
              data.test.percent_per_category ??
              {},
          });
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchResult();
  }, [resultId, searchParams]);
  if (!result) return <p>Loading results...</p>;

  const getRiskColor = (category: string) => {
    if (category === "Low Risk") return "text-[#7DD87D]";
    if (category === "Medium Risk") return "text-[#FFD54F]";
    return "text-red-600";
  };

  const confidencePercent = (result.confidence * 100).toFixed(1);

  const percentPerCategory =
    result?.percentPerCategory ??
    result?.percent_per_category ??
    {};

  const isMChat = result?.model_used?.toLowerCase() === "mchat";

  console.log("model_used:", result?.model_used);
  console.log("isMChat:", isMChat);
  console.log("FULL RESULT OBJECT:", JSON.stringify(result, null, 2));

  /* ------------------ Spectrum Data (5 Regions) ------------------ */

  let spectrumData = [];

  if (isMChat) {
    spectrumData = [
      {
        name: "Social Traits Intensity",
        value: percentPerCategory.social || 0,
        fill: "#52BFFF",
      },
      {
        name: "Communication Traits Intensity",
        value: percentPerCategory.communication || 0,
        fill: "#7DD87D",
      },
      {
        name: "Behavior Patterns Intensity",
        value: percentPerCategory.behavior || 0,
        fill: "#FF8FAB",
      },
      {
        name: "Motor Skills Traits Intensity",
        value: percentPerCategory.motor || 0,
        fill: "#FFD54F",
      },
    ];
  } else {
    // AQ
    spectrumData = [
      {
        name: "Social Traits Intensity",
        value: percentPerCategory.socialSkills || 0,
        fill: "#52BFFF",
      },
      {
        name: "Attention Switching Traits Intensity",
        value: percentPerCategory.attentionSwitching || 0,
        fill: "#FFD54F",
      },
      {
        name: "Attention to Details Trait Intensity",
        value: percentPerCategory.attentionToDetails || 0,
        fill: "#FF8FAB",
      },
      {
        name: "Communication Traits Intensity",
        value: percentPerCategory.communication || 0,
        fill: "#7DD87D",
      },
      {
        name: "Imagination Trait Intensity",
        value: percentPerCategory.imagination || 0,
        fill: "#A16FFF",
      },
    ];
  }

  const riskPercent = result.risk_percentage;

  const level =
    result.risk_category === "Low Risk"
      ? { n: 1, label: "", color: "text-green-600" }
      : result.risk_category === "Medium Risk"
        ? { n: 2, label: "Moderate", color: "text-yellow-600" }
        : { n: 3, label: "High Risk", color: "text-red-600" };

  const getSeverityLabel = (percent: number) => {
    if (percent <= 40) return "Low";
    if (percent <= 70) return "Moderate";
    return "High";
  };

  const getSeverityTextColor = (percent: number) => {
    if (percent <= 40) return "text-green-600";
    if (percent <= 70) return "text-yellow-600";
    return "text-red-600";
  };

  /* ------------------ Render ------------------ */

  return (
    <main className="min-h-screen pt-20 px-4 md:px-12 lg:px-20 pb-10">
      {/* Header */}
      <header className="mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 c/60 text-[#4b4b4b]/70 hover:text-[#4b4b4b] mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl text-[#4b4b4b] text-center font-bold mt-2">
          Assessment Results
        </h1>
      </header>

      {/* ================= 2 COLUMN TOP SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">

        {/* -------- LEFT COLUMN -------- */}
        <div className="bg-[#f1fafe] rounded-2xl p-6 shadow flex flex-col justify-between">

          {/* 1️⃣ Overall Assessment Level */}
          <div>
            <p className="text-sm text-[#4b4b4b]">
              Overall Assessment Level
            </p>

            <p className={cn("text-3xl font-bold", getRiskColor(result.risk_category))}>
              {result.risk_category}
            </p>
          </div>


          {/* 2️⃣ Risk Analysis + Risk Scale */}
          <div className="mt-6 bg-white rounded-xl p-4 border border-[#e3eefc]">
            <p className="text-sm text-[#4b4b4b]">Risk Analysis</p>

            <p className="text-3xl font-bold text-[#4b4b4b] mt-1">
              {riskPercent}%
            </p>

            <p className="text-xs text-[#4b4b4b]/70">
              indicators present
            </p>

            {/* Risk Scale Bar */}
            <div className="mt-4">
              <div className="w-full bg-[#e3eefc] rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${result.risk_percentage}%`,
                    backgroundColor:
                      result.risk_category === "Low Risk"
                        ? "#22c55e"
                        : result.risk_category === "Medium Risk"
                          ? "#eab308"
                          : "#ef4444",
                  }}
                />
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between text-[10px] text-[#4b4b4b]/60 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>


          {/* 3️⃣ Interpretation */}
          <div className="mt-6 bg-white rounded-xl p-4 border border-[#e3eefc]">
            <p className="text-sm font-semibold text-[#4b4b4b] mb-2">
              Interpretation
            </p>

            <p className="text-sm text-[#4b4b4b]/80 leading-relaxed">
              {result.risk_category === "Low Risk" &&
                "The assessment indicates minimal signs associated with autism spectrum traits. Continued developmental monitoring is recommended."}

              {result.risk_category === "Medium Risk" &&
                "The assessment suggests moderate presence of autism-related traits. A professional evaluation is recommended for further clarification."}

              {result.risk_category === "High Risk" &&
                "The assessment indicates significant indicators associated with autism spectrum traits. A comprehensive clinical evaluation is strongly advised."}
            </p>

            <Link
              href={`/article/${result.risk_category.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center text-[#77c1e6] font-sm underline hover:text-[#4b4b4b] transition-colors mt-1" >
              <Info className="w-3 h-3 mr-1" /> More Details <ExternalLink className="w-3 h-3 ml-1" /> </Link>
          </div>

          {/* 4️⃣ Model Confidence */}
          {/* <div className="mt-6 bg-white rounded-xl p-4 border border-[#e3eefc]">
            <p className="text-sm text-[#4b4b4b] mb-1">
              Model Confidence
            </p>

            <p className="text-2xl font-bold text-[#4b4b4b]">
              {confidencePercent}%
            </p>

            <div className="w-full bg-[#e3eefc] rounded-full h-2 mt-3">
              <div
                className="h-2 rounded-full bg-[#77c1e6] transition-all duration-500"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>

            <p className="text-xs text-[#4b4b4b]/70 mt-2 leading-relaxed">
              This reflects how certain the AI model is in its prediction based on the provided responses.
            </p>
          </div> */}
        </div>
        {/* -------- RIGHT COLUMN -------- */}
        <div className="bg-[#f1fafe] rounded-2xl p-6 shadow flex flex-col items-center">

          {/* Spectrum Wheel (Top) */}
          <h1 className="text-2xl font-semibold text-[#4b4b4b] mb-6 text-center">
            Autism Spectrum Wheel
          </h1>

          <div className="relative w-80 h-80 mb-8">
            <PolarAreaChart
              data={spectrumData}
              maxValue={MAX_SCORE}
              size={320}
            />

            {spectrumData.map((c, i) => {
              const angle = (360 / spectrumData.length) * i - 90;

              return (
                <div
                  key={c.name}
                  className="absolute text-[10px] sm:text-xs text-[#4b4b4b] font-medium text-center leading-tight max-w-[70px] sm:max-w-[90px]"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `
          rotate(${angle + 36}deg)
          translate(0, -120px)
          rotate(${-(angle + 36)}deg)
        `,
                  }}
                >

                </div>
              );
            })}
          </div>

          {/* Color Labels (Bottom) */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {spectrumData.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.fill }}
                />
                <span className="text-[#4b4b4b]">{c.name}</span>
              </div>
            ))}
          </div>

        </div>
      </div>


      {/* ---------------- Category Analysis ---------------- */}
      <div className="bg-[#f1fafe] rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold text-center text-[#4b4b4b] mb-6">
          Traits Analysis
        </h2>

        <div
          className={cn(
            "px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6",
            isMChat ? "lg:grid-cols-4" : "lg:grid-cols-5"
          )}
        >          {spectrumData.map((c) => (
          <div key={c.name} className="flex flex-col items-center">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: c.value, fill: c.fill },
                      { value: 100 - c.value, fill: "#dbe5f9" },
                    ]}
                    dataKey="value"
                    innerRadius={35}
                    outerRadius={55}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[#4b4b4b]">
                  {Math.round(c.value)}%
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm font-medium text-[#4b4b4b] text-center">
              {c.name}
            </p>

            <span
              className={cn(
                "text-xs font-medium mt-1",
                getSeverityTextColor(c.value)
              )}
            >
              {getSeverityLabel(c.value)}
            </span>
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}