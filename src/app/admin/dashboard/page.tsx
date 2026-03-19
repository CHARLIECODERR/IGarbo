"use client";

import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, ShieldCheck, Users } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-red-500">Admin Control Panel</h1>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-slate-400">
            <LogOut size={18} /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">You have full access to manage users, collectors, and system settings.</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline">Manage Users</Button>
                <Button variant="outline">System Logs</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-red-500" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold text-primary">System Secure</p>
              <p className="text-xs text-slate-500">Last backup: 2 hours ago</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
