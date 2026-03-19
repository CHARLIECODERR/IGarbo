"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, CheckCircle } from "lucide-react";

const STEPS = [
  {
    title: "Capture",
    description: "Take a photo of the waste and select its type.",
    icon: Camera,
    color: "bg-primary",
  },
  {
    title: "Locate",
    description: "Set your location and schedule a convenient time.",
    icon: MapPin,
    color: "bg-secondary",
  },
  {
    title: "Relax",
    description: "A collector will arrive and handle the rest.",
    icon: CheckCircle,
    color: "bg-primary-dark",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading sm:text-5xl mb-4">How it <span className="text-primary italic">works</span></h2>
          <p className="text-slate-400">Three simple steps to a cleaner neighborhood.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-[2.25rem] left-[15%] right-[15%] h-px border-t-2 border-dashed border-white/10 -z-10" />
          
          {STEPS.map((step, idx) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center max-w-xs group"
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-2xl transition-all group-hover:scale-110",
                step.color
              )}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-heading">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
