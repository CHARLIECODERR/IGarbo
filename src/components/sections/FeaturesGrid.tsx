"use client";

import { motion } from "framer-motion";
import { Recycle, MapPin, Bell, Shield, Smartphone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Real-time Tracking",
    description: "Watch your collector move towards you in real-time. No more guessing when your waste will be picked up.",
    icon: MapPin,
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/20 to-transparent",
  },
  {
    title: "Smart Routing",
    description: "Our AI optimizes every trip for the shortest path.",
    icon: Zap,
    className: "bg-secondary/10",
  },
  {
    title: "Eco Points",
    description: "Earn rewards for every pickup you complete.",
    icon: Recycle,
    className: "bg-primary/10",
  },
  {
    title: "Role-Based Access",
    description: "Dedicated dashboards for users, collectors, and admins to manage everything seamlessly.",
    icon: Shield,
    className: "md:col-span-2",
  },
  {
    title: "Instant Notifications",
    description: "Stay updated with push notifications on every step of your request.",
    icon: Bell,
    className: "bg-white/5",
  },
  {
    title: "Mobile First",
    description: "A fully responsive experience that looks great on any device.",
    icon: Smartphone,
    className: "bg-white/5",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-heading sm:text-5xl mb-4"
          >
            Everything you need for <br />
            <span className="text-primary">Seamless Waste Management</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Packed with premium features to make your environment cleaner and your life easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[180px]">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative rounded-3xl p-8 border border-white/5 flex flex-col justify-between overflow-hidden backdrop-blur-sm transition-all hover:border-white/20",
                feature.className
              )}
            >
              <div className="relative z-10">
                <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
              
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
