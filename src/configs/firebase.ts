import type { ServiceAccount } from "firebase-admin/app";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./firebaseAdminSdkKey.json" with { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const messaging = getMessaging(app);
