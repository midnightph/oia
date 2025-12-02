/* global Buffer */
import 'dotenv/config';
import admin from "firebase-admin";


if (!admin.apps.length) admin.initializeApp();
const db = getFirestore();

// ---------------------- UTILS ----------------------
const setCors = (res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
};


