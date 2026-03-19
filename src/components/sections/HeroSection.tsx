"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Recycle, MapPin, Bell } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl py-20">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20 transition-all bg-white/5 backdrop-blur-sm"
          >
            🚀 The future of waste management is here.{" "}
            <Link href="/signup" className="font-semibold text-primary ml-1 group">
              Join now <span aria-hidden="true" className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </motion.div>
        </div>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-8xl font-heading leading-[1.1]">
              Smart Waste <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary animate-gradient-x">Collection</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl leading-8 text-slate-400 max-w-2xl mx-auto"
          >
            Connect with local collectors, track your requests in real-time, and make waste management effortless. Igarbo uses AI-driven routing to bridge the gap.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-x-6"
          >
            <Link href="/signup">
              <Button size="lg" className="flex items-center gap-2 h-16 px-10 text-lg shadow-primary/30">
                Get Started Free <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-primary transition-colors flex items-center gap-1 group">
              Learn how it works <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Stats / Proof Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-6 lg:px-8 mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold font-heading">5k+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">Active Users</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold font-heading">120+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">Collectors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold font-heading">15k+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">Pickups Done</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold font-heading">24/7</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">Support</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
