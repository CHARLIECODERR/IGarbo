import { collection, query, where, getDocs, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { WasteRequest } from "./request-service";

export interface GlobalStats {
  totalRequests: number;
  completedPickups: number;
  totalUsers: number;
  totalCollectors: number;
  totalWeight: number; // Simulated
}

export const getGlobalStats = async (): Promise<GlobalStats> => {
  const requestsSnap = await getDocs(collection(db, "requests"));
  const usersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "user")));
  const collectorsSnap = await getDocs(query(collection(db, "users"), where("role", "==", "collector")));
  
  const allRequests = requestsSnap.docs.map(doc => doc.data() as WasteRequest);
  const completed = allRequests.filter(r => r.status === 'completed');

  return {
    totalRequests: allRequests.length,
    completedPickups: completed.length,
    totalUsers: usersSnap.size,
    totalCollectors: collectorsSnap.size,
    totalWeight: completed.length * 5, // Simulated 5kg per pickup
  };
};

export const subscribeToGlobalFeed = (callback: (data: WasteRequest[]) => void) => {
  const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(20));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WasteRequest));
    callback(data);
  });
};

export const getAllUsersByRole = async (role: 'user' | 'collector') => {
  const q = query(collection(db, "users"), where("role", "==", role));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
