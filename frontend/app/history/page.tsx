"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
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

/* ------------------ Helpers ------------------ */

const getRiskInfo = (category: string) => {
  if (category === "Low Risk")
    return { label: "Low", color: "text-green-600" };
  if (category === "Medium Risk")
    return { label: "Medium", color: "text-yellow-600" };
  if (category === "High Risk")
    return { label: "High", color: "text-red-600" };

  return { label: "Unknown", color: "text-muted-foreground" };
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
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [riskFilter, setRiskFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/tests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        // 🔥 Flatten children + tests
        const flattened = data.children.flatMap((child: any) =>
          child.tests.map((test: any) => ({
            id: test._id,
            childName: child.name,
            risk_percentage: test.risk_percentage,
            risk_category: test.risk_category,
            date: test.createdAt,
          }))
        );

        setResults(flattened);
      } catch (err) {
        console.error("Fetch history failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredResults = useMemo(() => {
  const filtered = results.filter((item) => {
    const matchesName = item.childName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const riskLabel = getRiskInfo(item.risk_category).label.toLowerCase();
    const matchesRisk =
      riskFilter === "all" || riskLabel === riskFilter;

    return matchesName && matchesRisk;
  });

  return filtered.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === "newest"
      ? timeB - timeA
      : timeA - timeB;
  });
}, [results, searchQuery, sortOrder, riskFilter]); 


  return (
    <main className="min-h-screen pt-20 px-4 md:px-12 lg:px-20">

    {/* Table */}
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-[#1a9fb0] text-2xl font-semibold text-[#1a3a5f] text-center mb-8">
        Assessment History
      </h2>

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

  {loading ? (
    <div className="text-center py-8 text-[#4b4b4b]/80">Loading...</div>
  ) : filteredResults.length === 0 ? (
    <div className="text-center py-8 text-[#4b4b4b]/80">No results found</div>
  ) : (
    <div className="">
      {/* Scrollable body */}
      <div className="max-h-80 overflow-y-auto rounded-lg">
        <table className="w-full bg-white border-collapse">
          <thead className="bg-[#f5f8fa] sticky top-0 z-10">
            <tr className="border-b border-[#e1e8f0] text-[#1a9fb0]">
              <th className="py-3 px-4 text-left text-sm font-semibold w-[50px]">
                No
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold">
                Name
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold">
                Risk
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold w-[200px]">
                Date & Time
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold">
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.map((item, index) => {
              const risk = getRiskInfo(item.risk_category);
              return (
                <tr
                  key={item.id}
                  className="border-b border-[#e1e8f0] hover:bg-[#e6f7ff] transition text-[#4b4b4b]/80"
                >
                  <td className="py-3 px-4 text-sm">{index + 1}</td>
                  <td className="py-3 px-4 text-center text-sm font-medium">{item.childName}</td>
                  <td className="py-3 px-4 text-center text-sm font-semibold">
                    <span className={cn(risk.color)}>{risk.label}</span>
                    <div className="text-xs text-gray-500">{item.risk_percentage}%</div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    <Link
                      href={`/result?resultId=${item.id}`}
                      className="inline-flex items-center gap-1 text-sm hover:underline"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>
    </main>
  );
}
