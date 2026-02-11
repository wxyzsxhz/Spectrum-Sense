"use client";

import { cn } from "@/lib/utils";
import { tableOfContents } from "../../data/milestones";

interface TableOfContentsProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

const TableOfContents = ({ activeId, onSelect }: TableOfContentsProps) => {
  return (
    <div className="w-full bg-[#2ab3c8]/10 text-[#4b4b4b] rounded-2xl shadow-card border border-[#1a9fb0]/20">
      <div className="p-4 border-b border-[#1a9fb0]/40">
        <h2 className="font-bold text-[#1a9fb0] text-lg">
          Table of Contents
        </h2>
      </div>

      <nav className="p-3 space-y-1">
        {tableOfContents.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "toc-link w-full text-left cursor-pointer hover:text-[#1a9fb0]/80 transition",
              activeId === item.id && "active",
              activeId === item.id ? "text-[#2ab3c8]" : "text-[#4b4b4b] hover:text-[#2ab3c8]"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
