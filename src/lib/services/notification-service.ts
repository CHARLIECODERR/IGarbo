import { collection, addDoc, query, where, onSnapshot, orderBy, doc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface IgarboNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  createdAt: any;
  link?: string;
}

export const sendNotification = async (notification: Omit<IgarboNotification, "id" | "createdAt" | "read">) => {
  try {
    await addDoc(collection(db, "notifications"), {
      ...notification,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const getUserNotifications = (userId: string, callback: (notifications: IgarboNotification[]) => void) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IgarboNotification[];
    callback(notifications);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  const docRef = doc(db, "notifications", notificationId);
  await updateDoc(docRef, { read: true });
};

export const markAllAsRead = async (notifications: IgarboNotification[]) => {
  const batch = writeBatch(db);
  notifications.forEach((n) => {
    if (!n.read && n.id) {
      const ref = doc(db, "notifications", n.id);
      batch.update(ref, { read: true });
    }
  });
  await batch.commit();
};
