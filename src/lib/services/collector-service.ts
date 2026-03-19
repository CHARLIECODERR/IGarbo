import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { WasteRequest } from "./request-service";
import { sendNotification } from "./notification-service";

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
  const requestSnap = await getDoc(requestRef);
  
  if (requestSnap.exists()) {
    const requestData = requestSnap.data() as WasteRequest;
    await updateDoc(requestRef, {
      status: "accepted",
      collectorId,
      collectorName,
      acceptedAt: new Date().toISOString(),
    });

    await sendNotification({
      userId: requestData.userId,
      title: "Request Accepted",
      message: `Your ${requestData.type} waste collection has been accepted by ${collectorName}.`,
      type: "success",
      link: "/user/dashboard"
    });
  }
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
  const requestSnap = await getDoc(requestRef);

  if (requestSnap.exists()) {
    const requestData = requestSnap.data() as WasteRequest;
    await updateDoc(requestRef, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });

    await sendNotification({
      userId: requestData.userId,
      title: "Pickup Completed",
      message: `Great news! Your ${requestData.type} waste collection is complete. Thank you for recycling!`,
      type: "success",
      link: "/user/dashboard"
    });
  }
};
