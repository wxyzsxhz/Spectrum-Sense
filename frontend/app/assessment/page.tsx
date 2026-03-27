"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type AssessmentType = "mchat" | "aq10";

type MChatQuestion = {
  id: number;
  text: string;
};

type AQ10Question = {
  id: string;
  text: string;
  section: number;
  sectionTitle: string;
  number: number;
};

/* ================= MCHAT (UNCHANGED) ================= */

const mchatQuestions: MChatQuestion[] = [
  {
    id: 1,
    text: "Does your child enjoy being swung, bounced on your knee, etc.?",
  },
  { id: 2, text: "Does your child take an interest in other children?" },
  {
    id: 3,
    text: "Does your child like climbing on things, such as up stairs?",
  },
  { id: 4, text: "Does your child enjoy playing peek-a-boo/hide-and-seek?" },
  {
    id: 5,
    text: "Does your child ever pretend (e.g., talk on phone, take care of dolls)?",
  },
  { id: 6, text: "Does your child use index finger to ask for something?" },
  { id: 7, text: "Does your child use index finger to indicate interest?" },
  { id: 8, text: "Can your child play properly with small toys?" },
  { id: 9, text: "Does your child bring objects to show you something?" },
  { id: 10, text: "Does your child look you in the eye?" },
  { id: 11, text: "Does your child seem oversensitive to noise?" },
  { id: 12, text: "Does your child smile in response to your face?" },
  { id: 13, text: "Does your child imitate you?" },
  { id: 14, text: "Does your child respond to name?" },
  { id: 15, text: "If you point at a toy, does your child look?" },
  { id: 16, text: "Does your child walk?" },
  { id: 17, text: "Does your child look at things you are looking at?" },
  { id: 18, text: "Does your child make unusual finger movements?" },
  { id: 19, text: "Does your child try to attract attention?" },
  { id: 20, text: "Have you wondered if your child is deaf?" },
  { id: 21, text: "Does your child understand what people say?" },
  { id: 22, text: "Does your child stare at nothing?" },
  { id: 23, text: "Does your child check your reaction?" },
];

/* ================= AQ 30 QUESTIONS ================= */

const aq10Questions: AQ10Question[] = [
  // Section 1 – Social Skills
  {
    id: "AQ1",
    number: 1,
    text: "Your child prefer to do things with others rather than on their own.",
    section: 1,
    sectionTitle: "Social Skills",
  },
  {
    id: "AQ2",
    number: 2,
    text: "Your child is drawn more strongly to people than to things.",
    section: 1,
    sectionTitle: "Social Skills",
  },
  {
    id: "AQ3",
    number: 3,
    text: "Your child finds it hard to make new friends.",
    section: 1,
    sectionTitle: "Social Skills",
  },
  {
    id: "AQ4",
    number: 4,
    text: "Your child enjoys social occasions.",
    section: 1,
    sectionTitle: "Social Skills",
  },
  {
    id: "AQ5",
    number: 5,
    text: "Your child enjoys meeting new people.",
    section: 1,
    sectionTitle: "Social Skills",
  },
  {
    id: "AQ6",
    number: 6,
    text: "Your child finds it easy to work out what someone is thinking.",
    section: 1,
    sectionTitle: "Social Skills",
  },

  // Section 2 – Attention Switching
  {
    id: "AQ7",
    number: 7,
    text: "Your child prefers doing things the same way repeatedly.",
    section: 2,
    sectionTitle: "Attention Switching",
  },
  {
    id: "AQ8",
    number: 8,
    text: "Your child gets strongly absorbed in one thing.",
    section: 2,
    sectionTitle: "Attention Switching",
  },
  {
    id: "AQ9",
    number: 9,
    text: "Your child keeps track of conversations in group.",
    section: 2,
    sectionTitle: "Attention Switching",
  },
  {
    id: "AQ10",
    number: 10,
    text: "Your child is not upset if routine changes.",
    section: 2,
    sectionTitle: "Attention Switching",
  },
  {
    id: "AQ11",
    number: 11,
    text: "Your child is easy to switch between activities.",
    section: 2,
    sectionTitle: "Attention Switching",
  },
  {
    id: "AQ12",
    number: 12,
    text: "New situations make your child anxious.",
    section: 2,
    sectionTitle: "Attention Switching",
  },

  // Section 3 – Attention to Detail
  {
    id: "AQ13",
    number: 13,
    text: "Your child often notice small sounds when others do not.",
    section: 3,
    sectionTitle: "Attention to Detail",
  },
  {
    id: "AQ14",
    number: 14,
    text: "Your child is fascinated by dates.",
    section: 3,
    sectionTitle: "Attention to Detail",
  },
  {
    id: "AQ15",
    number: 15,
    text: "Your child is fascinated by numbers.",
    section: 3,
    sectionTitle: "Attention to Detail",
  },
  {
    id: "AQ16",
    number: 16,
    text: "Your child tend to notice details that others do not.",
    section: 3,
    sectionTitle: "Attention to Detail",
  },
  {
    id: "AQ17",
    number: 17,
    text: "Your child usually concentrate more on the whole picture, rather than the small details.",
    section: 3,
    sectionTitle: "Attention to Detail",
  },
  {
    id: "AQ18",
    number: 18,
    text: "Your child does not usually notice small changes in a situation, or a person's appearance.",
    section: 3,
    sectionTitle: "Attention to Detail",
  },

  // Section 4 – Communication
  {
    id: "AQ19",
    number: 19,
    text: "Your child has difficulty understanding rules for polite behaviour.",
    section: 4,
    sectionTitle: "Communication",
  },
  {
    id: "AQ20",
    number: 20,
    text: "When your child talks, it is not always easy for others to get a word in edgeways.",
    section: 4,
    sectionTitle: "Communication",
  },
  {
    id: "AQ21",
    number: 21,
    text: "Your child does not know how to keep a conversation going with their peers.",
    section: 4,
    sectionTitle: "Communication",
  },
  {
    id: "AQ22",
    number: 22,
    text: "When your child talks on the phone, they are not sure when it is their turn to speak.",
    section: 4,
    sectionTitle: "Communication",
  },
  {
    id: "AQ23",
    number: 23,
    text: "Your child is often the last to understand the point of a joke.",
    section: 4,
    sectionTitle: "Communication",
  },
  {
    id: "AQ24",
    number: 24,
    text: "People often tell your child that they keep going on and on about the same thing.",
    section: 4,
    sectionTitle: "Communication",
  },
  {
    id: "AQ25",
    number: 25,
    text: "Your child is good at small talk.",
    section: 4,
    sectionTitle: "Communication",
  },

  // Section 5 – Imagination
  {
    id: "AQ26",
    number: 26,
    text: "Your child finds making up stories easy.",
    section: 5,
    sectionTitle: "Imagination",
  },
  {
    id: "AQ27",
    number: 27,
    text: "When your child are reading a story, they find it difficult to work out the characters' intentions or feelings.",
    section: 5,
    sectionTitle: "Imagination",
  },
  {
    id: "AQ28",
    number: 28,
    text: "Your child does not particularly enjoy fictional stories.",
    section: 5,
    sectionTitle: "Imagination",
  },
  {
    id: "AQ29",
    number: 29,
    text: "Your child likes to collect information about categories of things (e.g., types of car, types of bird, types of plant, etc.)",
    section: 5,
    sectionTitle: "Imagination",
  },
  {
    id: "AQ30",
    number: 30,
    text: "Your child finds it very easy to play games with children that involve pretending.",
    section: 5,
    sectionTitle: "Imagination",
  },
];

/* ================= OPTIONS ================= */

const aqOptions = [
  { value: 3, label: "Definitely Agree" },
  { value: 2, label: "Slightly Agree" },
  { value: 1, label: "Slightly Disagree" },
  { value: 0, label: "Definitely Disagree" },
];

const circleSizesAQ = [
  { size: "w-10 h-10", icon: "w-5 h-5" },
  { size: "w-8 h-8", icon: "w-4 h-4" },
  { size: "w-8 h-8", icon: "w-4 h-4" },
  { size: "w-10 h-10", icon: "w-5 h-5" },
];

/* ================= COMPONENT ================= */

export default function Assessment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const ageMonths = Number(searchParams.get("ageMonths"));
  const assessmentType: AssessmentType =
    ageMonths >= 18 && ageMonths <= 36 ? "mchat" : "aq10";

  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const childId = searchParams.get("childId");

    if (!token || !childId) {
      alert("Missing token or child ID");
      return;
    }

    let requestBody: any = {};

    if (assessmentType === "mchat") {
      mchatQuestions.forEach((q) => {
        requestBody[`Q${q.id}`] = answers[q.id] === 1 ? "yes" : "no";
      });
    } else {
      aq10Questions.forEach((q, index) => {
        requestBody[`Q${index + 1}`] = answers[q.id];
      });
    }

    const response = await fetch(`http://localhost:8000/child/${childId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    // After successful response from backend
    const result = data.result;

    // Redirect to results page
    router.push(`/result?result=${encodeURIComponent(JSON.stringify(result))}`);
  };

  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []);

  const totalQuestions =
    assessmentType === "mchat" ? mchatQuestions.length : aq10Questions.length;

  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  const currentAQSectionQuestions = aq10Questions.filter(
    (q) => q.section === currentSection,
  );

  const handleSelect = (id: string | number, value: number) => {
    setAnswers((prev) => ({ ...prev, [String(id)]: value }));
  };

  return (
    <main className="min-h-screen px-4 md:px-12 lg:px-20 py-8 pb-3">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#d0e9fc] px-4 pt-20 pb-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-[#4b4b4b]">
            {assessmentType === "mchat"
              ? "M-CHAT Assessment"
              : "AQ-30 Assessment"}
          </h1>

          {assessmentType === "aq10" && (
            <p className="text-sm font-semibold mt-2 text-[#4b4b4b]">
              Section {currentSection}/5 –{" "}
              {currentAQSectionQuestions[0]?.sectionTitle}
            </p>
          )}
        </header>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-[#4b4b4b] mb-2">
            <span>Progress</span>
            <span>
              {Object.keys(answers).length} of {totalQuestions} answered
            </span>
          </div>

          <div className="h-2 bg-[#4b4b4b] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2ab3c8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= MCHAT QUESTIONS ================= */}
      {assessmentType === "mchat" &&
        mchatQuestions.map((q) => (
          <div
            key={q.id}
            className={cn(
              "bg-[#f1fafe] rounded-xl p-3 shadow-sm transition-all mt-4 mx-2",
              answers[q.id] !== undefined && "border border-[#2ab3c8]",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              {/* LEFT SIDE — Question */}
              <div className="flex items-start gap-4 flex-1 pl-8">
                <span className="w-8 h-8 rounded-full bg-[#2ab3c8] text-[#4b4b4b] flex items-center justify-center font-semibold text-sm shrink-0">
                  {q.id}
                </span>

                <p className="text-[#4b4b4b] leading-relaxed">{q.text}</p>
              </div>

              {/* RIGHT SIDE — Yes / No */}
              <div className="flex items-center gap-10 shrink-0 pr-10">
                {["Yes", "No"].map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(q.id, index + 1)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition",
                        answers[q.id] === index + 1
                          ? "bg-[#2ab3c8] border-[#2ab3c8]"
                          : "border-2 border-[#2ab3c8] ",
                      )}
                    >
                      {answers[q.id] === index + 1 && (
                        <Check className="w-3 h-3" />
                      )}
                    </div>

                    <span className="text-sm text-[#4b4b4b]">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

      {assessmentType === "mchat" && (
        <div className="mt-8 pb-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < mchatQuestions.length}
            className="bg-[#2ab3c8] text-[#4b4b4b] font-semibold py-6 px-12 text-lg"
          >
            Submit Assessment
          </Button>
        </div>
      )}

      {/* AQ QUESTIONS */}
      {assessmentType === "aq10" &&
        currentAQSectionQuestions.map((q) => (
          <div
            key={q.id}
            className={cn(
              "bg-[#f1fafe] rounded-xl p-6 px-8 shadow-sm transition-all mt-3 mx-2",
              answers[q.id] && "border border-[#2ab3c8]",
            )}
          >
            <div className="flex gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#2ab3c8] text-[#4b4b4b] flex items-center justify-center font-semibold text-sm">
                {q.number}
              </span>
              <p className="text-[#4b4b4b] leading-relaxed">{q.text}</p>
            </div>

            <div className="flex items-center justify-between px-15 gap-6 mt-4">
              {aqOptions.map((opt, index) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(q.id, opt.value)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "rounded-full border-2 flex items-center justify-center transition-all",
                      circleSizesAQ[index].size,
                      answers[q.id] === opt.value
                        ? "bg-[#2ab3c8] border-[#2ab3c8]"
                        : "border-2 border-[#2ab3c8]",
                    )}
                  >
                    {answers[q.id] === opt.value && (
                      <Check className={circleSizesAQ[index].icon} />
                    )}
                  </div>
                  <span className="text-xs text-[#4b4b4b] text-center w-40">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

      {/* Navigation */}
      {assessmentType === "aq10" && (
        <div className="mt-8 pb-8 flex justify-center">
          {currentSection < 5 ? (
            <Button
              onClick={() => {
                setCurrentSection((prev) => prev + 1);
                requestAnimationFrame(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                });
              }}
              disabled={currentAQSectionQuestions.some(
                (q) => answers[q.id] === undefined,
              )}
              className="bg-[#2ab3c8] text-[#4b4b4b] font-semibold py-6 px-12 text-lg"
            >
              Next Section
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < totalQuestions}
              className="bg-[#2ab3c8] text-[#4b4b4b] font-semibold py-6 px-12 text-lg"
            >
              Submit Assessment
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
