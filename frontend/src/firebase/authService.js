// src/firebase/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

/* ✅ SIGN UP + send verification mail */
export async function signup(email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCred.user);
  return userCred.user;
}

/* ✅ LOGIN */
export async function login(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

/* ✅ LOGOUT */
export async function logout() {
  await signOut(auth);
}

/* ✅ FORGOT PASSWORD (reset email) */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}
