import { Baby, Smile, Hand } from "lucide-react";

const MilestoneIntro = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#2ab3c8]/10 rounded-2xl border border-[#1a9fb0]/20 shadow-card animate-fade-in px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 text-justify text-[#4b4b4b]">
              <div className="inline-block backdrop-blur-sm rounded-full mb-4 shadow-soft">
                <span className="text-3xl font-semibold">
                  Developmental Screening
                </span>
              </div>

              <h1 className="text-lg font-bold mb-4 leading-tight">
                Learn the Signs <br /> Act Early
              </h1>
              <p className="text-sm leading-relaxed">
                As a parent, you already have what it takes to help your young
                child learn and grow. Track your child's developmental milestones
                and share that progress, or any concerns, with your child's doctor
                at every check-up.
              </p> <br />

              <p className="text-sm leading-relaxed">
                This program aims to improve early identification of developmental
                delays and disabilities by promoting early childhood developmental
                monitoring by families, child care providers, and healthcare
                providers.
              </p>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3" />
                <img
                  src="/img1.png"
                  alt="Parent and child milestone development"
                  className="relative rounded-3xl shadow-card w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default MilestoneIntro;
