"use client";

import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  LogOut, Shield, Users, Truck, Package, TrendingUp, 
  BarChart3, Activity, Search, Filter, MoreHorizontal,
  CheckCircle2, Clock, AlertCircle, MapPin
} from "lucide-react";
import { useEffect, useState } from "react";
import { WasteRequest } from "@/lib/services/request-service";
import { getGlobalStats, subscribeToGlobalFeed, GlobalStats } from "@/lib/services/admin-service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [feed, setFeed] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const s = await getGlobalStats();
      setStats(s);
      setLoading(false);
    };
    fetchData();

    const unsubFeed = subscribeToGlobalFeed((data) => {
      setFeed(data);
    });

    return () => unsubFeed();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30">
              <Shield className="text-primary" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-white">Admin Console</h1>
              <p className="text-slate-400 mt-1 text-sm tracking-tight flex items-center gap-2">
                System Status: <span className="flex items-center gap-1 text-primary"><Activity size={12} /> Operational</span>
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} /> Exit Console
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Total Collectors", value: stats?.totalCollectors || 0, icon: Truck, color: "text-secondary", bg: "bg-secondary/10" },
            { label: "Total Requests", value: stats?.totalRequests || 0, icon: Package, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { label: "Weight Collected", value: `${stats?.totalWeight || 0}kg`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-white/5 bg-slate-900/40 hover:border-white/10 transition-all group">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                    </div>
                    <div className={cn("p-3 rounded-xl transition-all group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Global Feed */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                Live Activity Feed
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest border-white/5 opacity-50">
                  <Filter size={12} className="mr-2" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest border-white/5 opacity-50">
                  <Search size={12} className="mr-2" /> Search
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)
              ) : feed.map((request, i) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-white/5 bg-slate-900/20 overflow-hidden hover:bg-white/5 transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden glass shrink-0">
                        <img src={request.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-white">{request.userName}</p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin size={10} /> {request.address}
                            </p>
                          </div>
                          <div className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border",
                            request.status === 'completed' ? "text-primary border-primary/20 bg-primary/5" :
                            request.status === 'accepted' ? "text-secondary border-secondary/20 bg-secondary/5" :
                            "text-yellow-500 border-yellow-500/20 bg-yellow-500/5"
                          )}>
                            {request.status}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-2 text-slate-500 hover:text-white rounded-xl">
                        <MoreHorizontal size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-heading px-2">Platform Overview</h2>
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" /> Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Target Reach</span>
                    <span>75%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    Quick Reports
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="w-full justify-start text-[10px] h-9 border-white/5 hover:bg-white/5 font-bold uppercase tracking-wider">
                      Export Monthly Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-[10px] h-9 border-white/5 hover:bg-white/5 font-bold uppercase tracking-wider">
                      User Growth Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-slate-900/60">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <AlertCircle className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">System Alert</h4>
                    <p className="text-[10px] text-slate-500">Scheduled maintenance in 2h</p>
                  </div>
                </div>
                <Button size="sm" className="w-full py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-[10px] uppercase font-bold tracking-widest">
                  View Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
