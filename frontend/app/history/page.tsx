"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ------------------ Mock Data ------------------ */

const mockResults = [
  {
    id: "1",
    childName: "Emma Johnson",
    date: "2026-01-28T14:30:00",
    level: 2,
  },
  {
    id: "2",
    childName: "Liam Smith",
    date: "2026-01-27T10:15:00",
    level: 1,
  },
  {
    id: "3",
    childName: "Emma Johnson",
    date: "2026-01-25T09:00:00",
    level: 2,
  },
  {
    id: "4",
    childName: "Olivia Brown",
    date: "2026-01-24T16:45:00",
    level: 3,
  },
  {
    id: "5",
    childName: "Noah Davis",
    date: "2026-01-22T11:30:00",
    level: 1,
  },
];

/* ------------------ Helpers ------------------ */

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

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ------------------ Page ------------------ */

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [riskFilter, setRiskFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  const filteredResults = useMemo(() => {
    const filtered = mockResults.filter((item) => {
      const matchesName = item.childName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const riskLabel = getRiskInfo(item.level).label.toLowerCase();
      const matchesRisk = riskFilter === "all" || riskLabel === riskFilter;

      return matchesName && matchesRisk;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [searchQuery, sortOrder, riskFilter]);

  return (
    <main className="min-h-screen pt-20 px-4 md:px-12 lg:px-20">
      {/* Title */}
      <h1 className="text-[#1a9fb0] text-2xl font-bold text-center mb-8">
        Assessment History
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto">
        {/* Search by name */}
        <div className="relative flex-1 bg-[#f1fafe] text-[#4b4b4b] rounded-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search by child name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-b border-[#b3e0ff] text-[#4b4b4b]"
          />
        </div>

        {/* Risk Filter */}
        <Select
          value={riskFilter}
          onValueChange={(value) =>
            setRiskFilter(value as "all" | "low" | "medium" | "high")
          }
        >
          <SelectTrigger className="w-full md:w-[180px] bg-[#f1fafe] border-b border-[#b3e0ff]">
            <SelectValue placeholder="Filter risk" />
          </SelectTrigger>
          <SelectContent className="bg-[#f1fafe] text-[#4b4b4b]/80 border-b border-[#b3e0ff]">
            <SelectItem
              value="all"
              className="hover:bg-[#4b4b4b]/10 transition"
            >
              All Risks
            </SelectItem>
            <SelectItem
              value="low"
              className="hover:bg-[#4b4b4b]/10 transition"
            >
              Low
            </SelectItem>
            <SelectItem
              value="medium"
              className="hover:bg-[#4b4b4b]/10 transition"
            >
              Medium
            </SelectItem>
            <SelectItem
              value="high"
              className="hover:bg-[#4b4b4b]/10 transition"
            >
              High
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
        >
          <SelectTrigger className="bg-[#f1fafe] w-full md:w-[200px] border-b border-[#b3e0ff]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent className="bg-[#f1fafe] text-[#4b4b4b]/80 border-b border-[#b3e0ff]">
            <SelectItem
              value="newest"
              className="hover:bg-[#4b4b4b]/10 transition"
            >
              Newest → Oldest
            </SelectItem>
            <SelectItem
              value="oldest"
              className="hover:bg-[#4b4b4b]/10 transition"
            >
              Oldest → Newest
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="max-w-4xl bg-[#f1fafe] p-6 mx-auto border border-[#b3e0ff] rounded-lg overflow-hidden">
        <Table className="border-collapse">
          <TableHeader className="text-[#1a9fb0]">
            <TableRow className="border-b border-[#e1e8f0]">
              <TableHead className="w-[50px] font-semibold">No</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Risk</TableHead>
              <TableHead className="w-[200px] font-semibold">
                Date & Time
              </TableHead>
              <TableHead className="text-right font-semibold">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-[#4b4b4b]/80"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((item, index) => {
                const risk = getRiskInfo(item.level);

                return (
                  <TableRow
                    key={item.id}
                    className="p-6 text-[#4b4b4b]/80 border-b border-[#e1e8f0] hover:bg-[#e6f7ff] transition"
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell className="font-medium">
                      {item.childName}
                    </TableCell>

                    <TableCell className={cn("font-semibold", risk.color)}>
                      {risk.label}
                    </TableCell>

                    <TableCell>{formatDate(item.date)}</TableCell>

                    <TableCell className="text-right">
                      <Link
                        href={`/article/level-${item.level}`}
                        className="inline-flex items-center gap-1 text-sm hover:underline"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
