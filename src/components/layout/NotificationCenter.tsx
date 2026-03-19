"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { getUserNotifications, markNotificationAsRead, markAllAsRead, IgarboNotification } from "@/lib/services/notification-service";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<IgarboNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserNotifications(user.uid, (data) => {
        setNotifications(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllAsRead(notifications);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
      >
        <Bell size={20} className={cn("text-slate-400 group-hover:text-white transition-colors", unreadCount > 0 && "animate-pulse")} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-3 w-80 z-50 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-primary hover:text-primary-light uppercase tracking-wider"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 transition-colors relative group",
                        !n.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "mt-0.5 p-1.5 rounded-lg shrink-0",
                          n.type === "success" ? "bg-green-500/20 text-green-500" : 
                          n.type === "warning" ? "bg-yellow-500/20 text-yellow-500" : 
                          "bg-blue-500/20 text-blue-500"
                        )}>
                          {n.type === "success" ? <Check size={14} /> : 
                           n.type === "warning" ? <AlertTriangle size={14} /> : 
                           <Info size={14} />}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-white mb-0.5">{n.title}</h4>
                            {!n.read && (
                              <button 
                                onClick={() => n.id && markNotificationAsRead(n.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                              >
                                <X size={12} className="text-slate-500" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-600 font-medium">
                              {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                            </span>
                            {n.link && (
                              <Link 
                                href={n.link} 
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-bold text-primary hover:underline"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Bell size={32} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-xs text-slate-500">Perfectly quiet here.</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
               <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Igarbo Live Updates</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
