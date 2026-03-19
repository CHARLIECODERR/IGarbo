import { collection, addDoc, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";

export interface WasteRequest {
  id?: string;
  userId: string;
  userName: string;
  type: string;
  imageUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
}

export const createRequest = async (requestData: Omit<WasteRequest, "id" | "status" | "createdAt">) => {
  return await addDoc(collection(db, "requests"), {
    ...requestData,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
};

export const uploadRequestImage = async (file: File) => {
  const storageRef = ref(storage, `requests/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const getUserRequests = (userId: string, callback: (requests: WasteRequest[]) => void) => {
  const q = query(
    collection(db, "requests"),
    where("userId", "==", userId),
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
