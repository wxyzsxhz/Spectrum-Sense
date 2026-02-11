"use client";

import { ArrowLeft, Heart, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Milestone } from "../../data/milestones";

interface MilestoneDetailProps {
  milestone: Milestone;
  onBack: () => void;
}

const MilestoneDetail = ({ milestone, onBack }: MilestoneDetailProps) => {
  return (
    <div className="animate-fade-in bg-[#2ab3c8]/10 text-[#4b4b4b] rounded-2xl border border-[#1a9fb0]/20 shadow-card p-6">

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1a9fb0] mb-2">
              Milestones by {milestone.age}
            </h1>
            <p className="text-muted-foreground">{milestone.description}</p>
          </div>
        </div>
      </div>

      {/* What to Know */}
      <div className="text-sm rounded-2xl mb-4">
        <h2 className="font-bold text-lg text-[#1a9fb0] mb-3 flex items-center gap-2">
          What to Know
        </h2>
        <ul className="space-y-2 text-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            Learn about milestones most children reach by {milestone.age}.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            See what to share with your doctor.
          </li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-accent/30 rounded-2xl mt-8 mb-8">
        <h2 className="font-bold text-[#1a9fb0] text-lg mb-4">
          💡 Tips for Your {milestone.ageLabel} Old
        </h2>
        <ul className="space-y-3">
          {milestone.tips.map((tip, index) => (
            <li key={index} className="text-sm flex gap-3">
              <span>🌟</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MilestoneDetail;
