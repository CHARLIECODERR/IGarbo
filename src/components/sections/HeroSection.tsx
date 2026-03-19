"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Recycle, MapPin, Bell } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20"
          >
            The future of waste management is here.{" "}
            <Link href="/signup" className="font-semibold text-primary">
              <span className="absolute inset-0" aria-hidden="true" />
              Join now <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-heading"
          >
            Smart Waste Collection for a <span className="text-primary luxury-text">Cleaner World</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-400"
          >
            Connect with local collectors, track your requests in real-time, and make waste management effortless. Igarbo uses location-based technology to bridge the gap between you and a cleaner environment.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link href="/signup">
              <Button size="lg" className="flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-primary transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              {
                name: "Real-time Tracking",
                description: "Know exactly when your waste will be collected with live tracking and notifications.",
                icon: MapPin,
              },
              {
                name: "Fast Pickup",
                description: "Our optimized routing system ensures collectors reach you in the shortest time possible.",
                icon: Bell,
              },
              {
                name: "Eco-Friendly",
                description: "By optimizing routes, we reduce fuel consumption and contribute to a greener planet.",
                icon: Recycle,
              },
            ].map((feature, idx) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex flex-col bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-colors group"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-6 w-6 text-primary flex-none group-hover:scale-110 transition-transform" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
