"use client";

import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LogOut, Truck, MapPin, Clock, CheckCircle2, AlertCircle, Package, Timer, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { WasteRequest } from "@/lib/services/request-service";
import { getPendingRequests, getCollectorJobs, acceptRequest, completeRequest } from "@/lib/services/collector-service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CollectorMap } from "@/components/maps/CollectorMap";

export default function CollectorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<WasteRequest[]>([]);
  const [myJobs, setMyJobs] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeTab, setActiveTab] = useState<"available" | "my-jobs">("available");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const unsubPending = getPendingRequests((data) => {
        setPendingRequests(data);
        setLoading(false);
      });
      const unsubJobs = getCollectorJobs(user.uid, (data) => {
        setMyJobs(data);
      });
      return () => {
        unsubPending();
        unsubJobs();
      };
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const handleAccept = async (requestId: string) => {
    if (!user) return;
    try {
      await acceptRequest(requestId, user.uid, user.displayName || user.email || "Collector");
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      await completeRequest(requestId);
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading text-secondary">Collector Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">Active as: {user?.displayName || user?.email}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-slate-400">
            <LogOut size={18} /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <Card className="bg-secondary/10 border-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-2xl shadow-lg shadow-secondary/20">
                    <Truck className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Jobs Completed</p>
                    <p className="text-2xl font-bold text-white">{myJobs.filter(j => j.status === 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("available")}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                  activeTab === "available" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Package size={18} /> Available Jobs ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("my-jobs")}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                  activeTab === "my-jobs" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Timer size={18} /> My Active Jobs ({myJobs.filter(j => j.status === 'accepted').length})
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "available" ? (
                <motion.div
                  key="available"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-heading text-white">Available Requests Nearby</h2>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setViewMode("list")}
                        className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", viewMode === 'list' ? "bg-secondary text-white shadow-lg" : "text-slate-500")}
                      >
                        List
                      </button>
                      <button 
                        onClick={() => setViewMode("map")}
                        className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", viewMode === 'map' ? "bg-secondary text-white shadow-lg" : "text-slate-500")}
                      >
                        Map
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="h-40 rounded-3xl bg-white/5 animate-pulse" />
                  ) : viewMode === "list" ? (
                    <div className="grid gap-4">
                      {pendingRequests.length > 0 ? (
                        pendingRequests.map((request) => (
                          <Card key={request.id} className="group overflow-hidden border-white/5 hover:border-secondary/30 transition-all">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                              <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                                <img src={request.imageUrl} alt={request.type} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                  {request.type}
                                </div>
                              </div>
                              <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h3 className="font-bold text-xl mb-1">{request.userName}'s Pickup</h3>
                                      <p className="text-slate-400 text-sm flex items-center gap-2">
                                        <MapPin size={14} className="text-secondary" /> {request.address}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Scheduled For</p>
                                      <p className="text-sm font-semibold">{new Date(request.scheduledAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => handleAccept(request.id!)}
                                  className="w-full md:w-auto self-end bg-secondary hover:bg-secondary/80 text-white"
                                >
                                  Accept Job
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                          <p className="text-slate-500">No pending requests available at the moment.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <CollectorMap 
                      requests={pendingRequests} 
                      onAccept={(req) => handleAccept(req.id!)} 
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="my-jobs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold font-heading">Current Assignments</h2>
                  {myJobs.length > 0 ? (
                    <div className="grid gap-4">
                      {myJobs.map((job) => (
                        <Card key={job.id} className={cn(
                          "border-white/5",
                          job.status === 'completed' ? "opacity-60" : "border-secondary/30"
                        )}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl overflow-hidden glass">
                                  <img src={job.imageUrl} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <h3 className="font-bold">{job.type} Collection</h3>
                                  <p className="text-xs text-slate-500">{job.address}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {job.status === 'accepted' ? (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleComplete(job.id!)}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                  >
                                    <Check size={16} /> Complete
                                  </Button>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest">
                                    <CheckCircle2 size={16} /> Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-slate-500">You haven't accepted any jobs yet.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
