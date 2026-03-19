"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Recycle, ArrowRight, User, Truck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [role, setRole] = useState<"user" | "collector" | "admin" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });
      
      router.push(`/${role}/dashboard`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold font-heading text-white tracking-tight">Igarbo</span>
          </Link>
        </div>
        
        <Card className="border-white/10">
          <form onSubmit={handleSignup}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl">Create an account</CardTitle>
              <CardDescription>
                Join the movement for a cleaner environment
              </CardDescription>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { id: "user", label: "User", icon: User },
                  { id: "collector", label: "Collector", icon: Truck },
                  { id: "admin", label: "Admin", icon: ShieldCheck },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                      role === r.id 
                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                        : "border-white/5 bg-white/5 text-slate-400 hover:border-white/20"
                    )}
                  >
                    <r.icon size={20} />
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2">
                {loading ? "Creating..." : "Create Account"} <ArrowRight size={18} />
              </Button>
            </CardContent>
          </form>
          <CardFooter>
            <div className="text-sm text-center w-full text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
