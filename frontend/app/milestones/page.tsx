"use client";

import { useState } from "react";
import MilestoneIntro from "@/components/MilestoneIntro";
import MilestoneTracker from "@/components/MilestoneTracker";
import TableOfContents from "@/components/TableOfContents";
import MilestoneDetail from "@/components/MilestoneDetail";
import { milestones } from "data/milestones";
import MilestoneCard from "@/components/MilestoneCard";

const Index = () => {
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

    const selectedMilestone = milestones.find(
        (m) => m.id === selectedMilestoneId
    );

    return (
        <div className="min-h-screen  bg-gradient-to-b from-white/40 via-white/20 to-white/60 pt-20 p-8">
            <section className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT — TOC + Detail */}
                    <aside className="lg:col-span-1 sticky top-24 self-start space-y-6">
                        <TableOfContents
                            activeId={selectedMilestoneId}
                            onSelect={setSelectedMilestoneId}
                        />

                        {selectedMilestone && (
                            <MilestoneDetail
                                milestone={selectedMilestone}
                                onBack={() => setSelectedMilestoneId(null)}
                            />
                        )}
                    </aside>

                    {/* RIGHT — Intro OR Tracker */}
                    <main className="lg:col-span-2 w-full space-y-8">
                        {!selectedMilestone && (
                            <>
                                <MilestoneIntro />
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {milestones.map((milestone) => (
                                        <MilestoneCard
                                            key={milestone.id}
                                            milestone={milestone}
                                            onClick={() => setSelectedMilestoneId(milestone.id)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {selectedMilestone && (
                            <MilestoneTracker
                                milestone={selectedMilestone}
                                onBack={() => setSelectedMilestoneId(null)}
                            />
                        )}
                    </main>

                </div>
            </section>
        </div>
    );
};

export default Index;
