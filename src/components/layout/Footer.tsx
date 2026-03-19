"use client";

import Link from "next/link";
import { Recycle, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Recycle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold font-heading text-white">Igarbo</span>
        </div>
        
        <div className="flex gap-8 text-sm text-slate-500">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        <div className="flex gap-4">
          <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-400">
            <Twitter size={18} />
          </Link>
          <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-400">
            <Github size={18} />
          </Link>
          <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-400">
            <Linkedin size={18} />
          </Link>
        </div>
      </div>
      <div className="text-center mt-12 text-slate-600 text-xs">
        © {new Date().getFullYear()} Igarbo. All rights reserved.
      </div>
    </footer>
  );
}
