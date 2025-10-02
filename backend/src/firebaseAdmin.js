// src/firebaseAdmin.js
import admin from "firebase-admin";

const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (svcJson) {
  // when JSON string is present in env var
  try {
    const serviceAccount = JSON.parse(svcJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase admin initialized from JSON env");
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON", err);
    process.exit(1);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // fallback to default credentials (mounted file)
  admin.initializeApp();
  console.log("Firebase admin initialized from GOOGLE_APPLICATION_CREDENTIALS");
} else {
  console.warn("No firebase credentials provided — admin not initialized");
}

export const auth = admin.auth();
export const firestore = admin.firestore();
