"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Recycle } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthPage) return null;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-white tracking-tight">Igarbo</span>
          </Link>
        </div>
        <div className="flex gap-x-8">
          <Link href="/features" className="text-sm font-semibold leading-6 text-slate-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/how-it-works" className="text-sm font-semibold leading-6 text-slate-400 hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6 text-slate-400 hover:text-white transition-colors">
            About
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
