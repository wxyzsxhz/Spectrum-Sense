import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Heart, Users, Target, Eye } from "lucide-react";

const visionItems = [
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To create a world where every child receives early support and understanding, enabling them to thrive and reach their full potential regardless of neurodevelopmental differences.",
  },
  {
    icon: Target,
    title: "Our Mission",
    description:
      "We empower parents, guardians, and healthcare professionals with accessible tools and knowledge for early ASD awareness, bridging the gap between concern and professional guidance.",
  },
  {
    icon: Users,
    title: "Who We Serve",
    description:
      "Parents seeking answers, healthcare providers looking for screening resources, and educators wanting to better understand the children in their care.",
  },
];

const faqItems = [
  {
    question: "What is ASD Risk Analysis?",
    answer:
      "ASD Risk Analysis is an awareness and screening tool designed to help identify potential signs of Autism Spectrum Disorder in children. It provides preliminary insights based on behavioral observations and developmental milestones, helping parents and caregivers decide when to seek professional evaluation.",
  },
  {
    question: "Is this tool a medical diagnosis?",
    answer:
      "No, this tool is NOT a medical diagnosis. It is designed for awareness and early screening purposes only. A formal ASD diagnosis can only be made by qualified healthcare professionals such as pediatricians, psychologists, or developmental specialists through comprehensive evaluation.",
  },
  {
    question: "Who should use this tool?",
    answer:
      "This tool is designed for parents, guardians, caregivers, and healthcare professionals who want to better understand a child's developmental patterns. It can be particularly helpful for those who have concerns about a child's social communication, behavior, or developmental milestones.",
  },
  {
    question: "What age range does this screening cover?",
    answer:
      "Our screening tool is designed for children between 18 months and 5 years of age, which is the critical window for early detection and intervention. However, we also provide resources for older children and adults.",
  },
  {
    question: "How accurate is the risk assessment?",
    answer:
      "Our assessment is based on established screening criteria and research. While it provides valuable insights, it should be used as a starting point for discussion with healthcare providers, not as a definitive result. Early screening tools typically have high sensitivity to ensure potential cases are not missed.",
  },
  {
    question: "What should I do if the results indicate elevated risk?",
    answer:
      "If the screening indicates elevated risk, we recommend scheduling an appointment with your child's pediatrician or a developmental specialist. Early intervention services can make a significant positive impact on a child's development, so timely professional evaluation is important.",
  },
  {
    question: "Is my data kept private and secure?",
    answer:
      "Yes, we take data privacy very seriously. All personal information and assessment results are encrypted and stored securely. We do not share individual data with third parties. Please review our Privacy Policy for complete details.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#d0e9fc] bg-gradient-to-b from-white/40 via-white/20 to-white/40 font-kids">
      <main className="flex-1 ml-10 mr-10 pt-15">
        {/* Hero Section */}
        <section className="py-2 lg:py-12">
          <div className="container mx-auto px-2 lg:px-8 text-center">
            <h1 className="text-4xl text-[#4b4b4b] md:text-5xl font-bold mb-4">
              Supporting Families on Their Journey
            </h1>
            <p className="text-lg text-[#4b4b4b] max-w-2xl mx-auto">
              We believe in the power of early awareness and the importance of
              providing families with the resources they need to support their
              children.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section>
          <div className="container mx-auto px-2 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {visionItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f1fafe] rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  {/* Centered icon + title */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#d0e9fc] flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-[#F38081]" />
                    </div>

                    <h3 className="text-xl font-bold text-[#77c1e6]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Justified paragraph */}
                  <p className="text-sm text-[#4b4b4b] text-justify leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-2 lg:py-6">
          <div className="container mx-auto px-4 lg:px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4b4b4b] mt-10 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-[#f1fafe] rounded-xl border border-gray-200 px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-[#4b4b4b] hover:text-[#F38081] py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-justify text-gray-700 pb-5 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-2 lg:py-6 mb-6">
          <div className="container mx-auto px-3 lg:px-3">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4b4b4b] mb-4">
                Get In Touch
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Email */}
              <div className="bg-[#f1fafe] rounded-xl p-8 text-center shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-14 h-14 rounded-full bg-[#d0e9fc] mx-auto flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-[#F38081]" />
                </div>
                <h3 className="font-semibold text-[#77c1e6] mb-2">Email Us</h3>
                <p className="text-gray-700 text-sm mb-3">
                  We will respond within 24 hours
                </p>
                <a
                  href="mailto:support@asdrisk.com"
                  className="text-[#F38081] font-medium hover:text-[#4b4b4b] transition"
                >
                  support@asdrisk.com
                </a>
              </div>

              {/* Phone */}
              <div className="bg-[#f1fafe] rounded-xl p-8 text-center shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-14 h-14 rounded-full bg-[#d0e9fc] mx-auto flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-[#F38081]" />
                </div>
                <h3 className="font-semibold text-[#77c1e6] mb-2">Call Us</h3>
                <p className="text-gray-700 text-sm mb-3">Mon–Fri, 8am–6pm</p>
                <a
                  href="tel:1-800-ASD-HELP"
                  className="text-[#F38081] font-medium hover:text-[#4b4b4b] transition"
                >
                  1-800-ASD-HELP
                </a>
              </div>

              {/* Location */}
              <div className="bg-[#f1fafe] rounded-xl p-8 text-center shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-14 h-14 rounded-full bg-[#d0e9fc] mx-auto flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#F38081]" />
                </div>
                <h3 className="font-semibold text-[#77c1e6] mb-2">Visit Us</h3>
                <p className="text-[#4b4b4b] font-medium">
                  Healthcare District,
                  <br />
                  City, State 12345
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
