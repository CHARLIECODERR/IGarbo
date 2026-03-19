"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { uploadRequestImage, createRequest } from "@/lib/services/request-service";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Calendar, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MapPicker } from "@/components/maps/MapPicker";

const WASTE_TYPES = ["Plastic", "Organic", "Metal", "Paper", "Electronic", "Other"];

export default function NewRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState(WASTE_TYPES[0]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [schedule, setSchedule] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !image || !address || !schedule || !location) {
      if (!location) alert("Please select a location on the map.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadRequestImage(image);
      await createRequest({
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "User",
        type,
        imageUrl,
        address,
        latitude: location.lat,
        longitude: location.lng,
        scheduledAt: schedule,
      });
      router.push("/user/dashboard");
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <Link href="/user/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-white/10 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trash2 className="text-primary" /> Create New Request
              </CardTitle>
              <CardDescription>Fill in the details for your waste collection pickup</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capture/Upload Garbage Image</label>
                  <div 
                    onClick={() => document.getElementById("image-upload")?.click()}
                    className={cn(
                      "aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group",
                      preview && "border-primary/50"
                    )}
                  >
                    {preview ? (
                      <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-primary/20 p-4 rounded-full mb-2">
                          <Camera className="text-primary" size={32} />
                        </div>
                        <p className="text-sm text-slate-400">Click to upload or take a photo</p>
                      </>
                    )}
                  </div>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                </div>

                {/* Waste Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Garbage Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {WASTE_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          "px-4 py-2 rounded-xl border text-sm transition-all",
                          type === t 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Pin Your Precise Location</label>
                  <MapPicker onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
                  
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input 
                      placeholder="Confirm your street address/landmark" 
                      className="pl-12" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Pickup Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input 
                      type="datetime-local" 
                      className="pl-12" 
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Processing...
                    </>
                  ) : (
                    <>
                      Submit Request <ArrowRight size={20} />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
