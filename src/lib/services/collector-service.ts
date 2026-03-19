import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { WasteRequest } from "./request-service";

export const getPendingRequests = (callback: (requests: WasteRequest[]) => void) => {
  const q = query(
    collection(db, "requests"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WasteRequest[];
    callback(requests);
  });
};

export const acceptRequest = async (requestId: string, collectorId: string, collectorName: string) => {
  const requestRef = doc(db, "requests", requestId);
  return await updateDoc(requestRef, {
    status: "accepted",
    collectorId,
    collectorName,
    acceptedAt: new Date().toISOString(),
  });
};

export const getCollectorJobs = (collectorId: string, callback: (requests: WasteRequest[]) => void) => {
  const q = query(
    collection(db, "requests"),
    where("collectorId", "==", collectorId),
    where("status", "in", ["accepted", "completed"]),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WasteRequest[];
    callback(requests);
  });
};

export const completeRequest = async (requestId: string) => {
  const requestRef = doc(db, "requests", requestId);
  return await updateDoc(requestRef, {
    status: "completed",
    completedAt: new Date().toISOString(),
  });
};
