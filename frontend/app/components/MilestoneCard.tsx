import Image from "next/image";
import { cn } from "@/lib/utils";
import { Milestone } from "../../data/milestones";

interface MilestoneCardProps {
  milestone: Milestone;
  onClick: () => void;
}

const MilestoneCard = ({ milestone, onClick }: MilestoneCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#2ab3c8]/10 w-full text-left group rounded-lg border border-[#1a9fb0]/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Image section */}
      <div
        className={cn(
          "h-32 relative overflow-hidden rounded-tl-lg rounded-tr-lg",
          milestone.colorClass
        )}
      >
        <Image
          src={milestone.image}
          alt={milestone.age}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          priority
        />
      </div>

      {/* Text section */}
      <div className="p-3 space-y-1 text-[#4b4b4b]">
        <h3 className="font-bold text-lg">
          Milestones by {milestone.age}
        </h3>

        <p className="text-sm leading-snug">
          {milestone.description}
        </p>
      </div>
    </button>
  );
};

export default MilestoneCard;
