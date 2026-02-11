"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PolarAreaChart from "@/components/PolarAreaChart";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
} from "recharts";

/* ------------------ Categories ------------------ */

const categories = [
    { id: "communication", name: "Communication", questions: ["A1", "A2", "A8"] },
    { id: "social", name: "Social Interaction", questions: ["A4", "A6", "A7"] },
    { id: "sensory", name: "Sensory", questions: ["A10"] },
    { id: "behavioral", name: "Behavioral", questions: ["A3", "A5", "A9"] },
];

const categoryColors: Record<string, string> = {
    communication: "#FF8FAB",
    social: "#52BFFF",
    sensory: "#7DD87D",
    behavioral: "#FFD54F",
};

const MAX_SCORE = 5;

/* ------------------ Page ------------------ */

export default function Results() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const answersParam = searchParams.get("answers");

    const answers: Record<string, number> = answersParam
        ? JSON.parse(decodeURIComponent(answersParam))
        : {
            A1: 2,
            A2: 3,
            A3: 1,
            A4: 4,
            A5: 2,
            A6: 3,
            A7: 5,
            A8: 2,
            A9: 1,
            A10: 4,
        };

    /* ------------------ Calculations ------------------ */

    const calcScore = (ids: string[]) =>
        ids.reduce((sum, id) => sum + (answers[id] ?? 3), 0) / ids.length;

    const categoryScores = categories.map((c) => {
        const score = calcScore(c.questions);
        return {
            ...c,
            score,
            percent: Math.round((score / MAX_SCORE) * 100),
            fill: categoryColors[c.id],
        };
    });

    const spectrumData = categoryScores.map((c) => ({
        name: c.name,
        value: c.score,
        fill: c.fill,
    }));

    const overall =
        categoryScores.reduce((s, c) => s + c.score, 0) /
        categoryScores.length;

    const riskPercent = Math.round((overall / MAX_SCORE) * 100);

    const level =
        overall <= 2
            ? { n: 1, label: "Mild", color: "text-green-600" }
            : overall <= 3.5
                ? { n: 2, label: "Moderate", color: "text-yellow-600" }
                : { n: 3, label: "Severe", color: "text-red-600" };

    const getSeverityLabel = (score: number) => {
        if (score <= 2) return "Low";
        if (score <= 3.5) return "Moderate";
        return "High";
    };

    const getSeverityTextColor = (score: number) => {
        if (score <= 2) return "text-green-600";
        if (score <= 3.5) return "text-yellow-600";
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

                <h1 className="text-2xl text-[#4b4b4b] text-center font-bold mt-2">
                    ASD Assessment Results
                </h1>
            </header>

            {/* Overall Level */}
            <div className="bg-[#f1fafe] rounded-2xl p-6 shadow mb-8">
                <div className="ml-20 flex justify-between items-center">
                    <div className="">
                        <p className="text-sm text-[#4b4b4b]">
                            Overall Assessment Level
                        </p>
                        <p className={cn("text-3xl font-bold", level.color)}>
                            Level {level.n} ({level.label})
                        </p>
                        <Link
                            href={`/article/level-${level.n}`}
                            className="inline-flex items-center text-[#77c1e6] font-sm underline
                            hover:text-[#4b4b4b] transition-colors">
                            <Info className="w-3 h-3 mr-1" />
                            More Details
                            <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                    </div>

                    <div className="text-right mr-20">
                        <p className="text-sm text-[#4b4b4b]">Risk Analysis</p>
                        <p className="text-3xl font-bold text-[#7DD87D]">
                            {riskPercent}%
                        </p>
                        <p className="text-sm text-[#4b4b4b]">
                            indicators present
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- Spectrum Wheel ---------------- */}
            <div className="bg-[#f1fafe] rounded-2xl p-6 shadow mb-8">
                <h1 className="text-lg font-semibold text-center text-[#4b4b4b] mb-6">
                    Autism Spectrum Wheel
                </h1>

                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    <div className="relative w-80 h-80">
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
                                    className="absolute text-xs text-[#4b4b4b] font-medium whitespace-nowrap"
                                    style={{
                                        top: "50%",
                                        left: "50%",
                                        transform: `
                      rotate(${angle + 45}deg)
                      translate(0, -150px)
                      rotate(${-(angle + 45)}deg)
                    `,
                                    }}
                                >
                                    {c.name}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {categoryScores.map((c) => (
                            <div key={c.id} className="flex items-center gap-2">
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
                    Category Analysis
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categoryScores.map((c) => (
                        <div key={c.id} className="flex flex-col items-center">
                            <div className="w-32 h-32 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { value: c.percent, fill: c.fill },
                                                { value: 100 - c.percent, fill: "#dbe5f9" },
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
                                        {c.percent}%
                                    </span>
                                </div>
                            </div>

                            <p className="mt-2 text-sm font-medium text-[#4b4b4b] text-center">
                                {c.name}
                            </p>

                            <span
                                className={cn(
                                    "text-xs font-medium mt-1",
                                    getSeverityTextColor(c.score)
                                )}
                            >
                                {getSeverityLabel(c.score)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
