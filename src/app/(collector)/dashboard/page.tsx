"use client";

import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Truck } from "lucide-react";

export default function CollectorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-heading">Collector Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Welcome back, {user?.displayName || user?.email}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">You are logged in as a Collector. Here you can view and accept garbage collection requests near you.</p>
              <Button variant="secondary" className="mt-6">View Nearby Jobs</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck size={20} className="text-secondary" /> Vehicle Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-400 italic">No vehicle assigned yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
