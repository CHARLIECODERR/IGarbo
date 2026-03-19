"use client";

import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, User as UserIcon, Plus, Clock, CheckCircle2, AlertCircle, MapPin, Trash2, Recycle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserRequests, WasteRequest } from "@/lib/services/request-service";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserRequests(user.uid, (data) => {
        setRequests(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (authLoading) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-primary bg-primary/10 border-primary/20";
      case "accepted": return "text-secondary bg-secondary/10 border-secondary/20";
      default: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 size={14} />;
      case "accepted": return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">User Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">Welcome back, {user?.displayName || user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/user/new-request">
              <Button className="flex items-center gap-2">
                <Plus size={18} /> New Request
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-slate-400">
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
              Recent Requests 
              <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-slate-500 font-normal">
                {requests.length} total
              </span>
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <Card key={request.id} className="group hover:border-primary/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative h-20 w-20 rounded-2xl overflow-hidden glass shadow-xl flex-shrink-0">
                          <img 
                            src={request.imageUrl} 
                            alt={request.type} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{request.type} Waste</h3>
                              <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {request.address}
                              </p>
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                              getStatusColor(request.status)
                            )}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </div>
                          </div>
                          <div className="text-xs text-slate-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> Ordered: {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> Pickup: {new Date(request.scheduledAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-white/10 bg-transparent py-16">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <div className="bg-primary/10 p-6 rounded-full mb-4">
                    <Trash2 className="text-primary" size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No active requests</h3>
                  <p className="text-slate-500 max-w-sm mb-8">
                    You haven't made any waste collection requests yet. Create your first one to get started!
                  </p>
                  <Link href="/user/new-request">
                    <Button variant="outline" className="rounded-2xl">
                      Create First Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold font-heading">Overview</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserIcon size={20} className="text-primary" /> Profile Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Authenticated as</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Role</p>
                    <p className="text-sm font-medium text-primary">User</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Pickups</p>
                    <p className="text-sm font-medium">{requests.filter(r => r.status === 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/20 overflow-hidden relative group">
              <CardContent className="p-6 pt-6">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">Eco Impact</h3>
                  <p className="text-sm text-slate-400 mb-4 tracking-tight">By recycling properly, you've saved approximately <span className="text-primary font-bold">{requests.filter(r => r.status === 'completed').length * 2}kg</span> of carbon emissions so far.</p>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (requests.filter(r => r.status === 'completed').length * 2 / 20) * 100)}%` }}
                      className="bg-primary h-full"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">Next reward at 20kg</p>
                </div>
                <Recycle size={80} className="absolute -bottom-4 -right-4 text-primary/5 group-hover:rotate-45 transition-transform duration-1000" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
