"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  const handleCheckASDRisk = () => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isLoggedIn) {
        // User is logged in, go to dashboard
        router.push("/dashboard");
      } else {
        // User is not logged in, go to login page
        router.push("/login");
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-background flex items-center text-[#4b4b4b] justify-center overflow-hidden pt-15">
      {/* Background Section #FDF6D8 #BDD8F1*/}
      {/* Optional soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 pointer-events-none" />

      <img
        src="/img.png"
        alt="Spectrum Sense illustration"
        className="
          absolute
          top-0
          right-0
          bottom-0
          w-[800px]        /* control size here */
          md:w-[1100px]
          lg:w-[1100px]
          opacity-90
          pointer-events-none
        "
      />

      {/* Content */}
      <div className="container relative z-10 px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-2xl text-left">
          <h1 className="font-kids text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight -mt-10 mb-3 animate-fade-in">
            Spectrum Sense <br />
            <span className="text-accent">ASD Risk Analysis</span>
          </h1>

          <p className="text-sm md:text-lg text-muted-foreground text-justify leading-relaxed mr-20 mb-6 animate-fade-in">
            Autism Spectrum Disorder (ASD) affects how individuals perceive and
            interact with the world. Our tool helps parents, guardians, and
            healthcare professionals identify potential signs early.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in">
            {/* Check ASD Risk Button - Now uses onClick handler */}
            <Button
              onClick={handleCheckASDRisk}
              variant="cta"
              size="xl"
              className="bg-[#77c1e6] text-white font-bold px-4 py-2 rounded-lg
                hover:bg-[#4b4b4b] transition-colors cursor-pointer"
            >
              Check ASD Risk <ArrowRight />
            </Button>

            {/* Learn More Button - Still uses Link for direct navigation */}
            <Link href="/article">
              <Button
                variant="ctaSecondary"
                size="xl"
                className="bg-[#EFD780] text-white font-bold px-4 py-2 rounded-lg
                  hover:bg-[#4b4b4b] transition-colors cursor-pointer"
              >
                <BookOpen /> Learn More
              </Button>
            </Link>
          </div>

          <div className="flex items-start gap-3 bg-primary/20 border border-primary/40 rounded-xl p-2 mr-45 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">
              <strong>
                Important: This tool is for awareness only, not a medical
                diagnosis.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
