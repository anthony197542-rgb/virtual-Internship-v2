"use client";

import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { auth } from "../lib/firebase";

const features = [
  ["▤", "Read or listen", "Save time by getting the core ideas from the best books."],
  ["✦", "Find your next read", "Explore book lists and personalized recommendations."],
  ["◉", "Briefcasts", "Gain valuable insights from briefcasts you can enjoy anywhere."],
];

const reviews = [
  ["Hanna M.", "This app has been a game-changer for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers."],
  ["David B.", "I love this app! It provides concise and accurate summaries of books in a way that is easy to understand. It's also very user-friendly and intuitive."],
  ["Nathan S.", "This app is a great way to get the main takeaways from a book without having to read the entire thing. The summaries are well-written and informative."],
  ["Ryan R.", "If you're a busy person who loves reading but doesn't have the time to read every book in full, this app is for you!"],
];

const stats = [["3 Million", "Downloads on all platforms"], ["4.5 Stars", "Average ratings on iOS and Google Play"], ["97%", "Of Summarist members create a better reading habit"]];

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const { user, firebaseReady } = useAuth();
  const displayEmail = user?.email || userEmail;

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthError("");
    setShowAuth(true);
  }

  async function submitAuth(event) {
    event.preventDefault();
    if (!email.includes("@")) return setAuthError("Enter a valid email address.");
    if (password.length < 6) return setAuthError("Password must be at least 6 characters.");
    try {
      if (firebaseReady && auth) {
        if (authMode === "login") await signInWithEmailAndPassword(auth, email, password);
        else await createUserWithEmailAndPassword(auth, email, password);
      } else setUserEmail(email);
      setShowAuth(false);
      setEmail("");
      setPassword("");
      router.push("/for-you");
    } catch (error) {
      const messages = { "auth/invalid-credential": "Email or password is incorrect.", "auth/invalid-login-credentials": "Email or password is incorrect.", "auth/user-not-found": "No account exists for this email. Create an account first.", "auth/wrong-password": "Email or password is incorrect.", "auth/email-already-in-use": "An account already exists for this email. Log in instead.", "auth/operation-not-allowed": "Enable Email/Password in Firebase Console → Authentication → Sign-in method.", "auth/admin-restricted-operation": "Firebase has restricted this sign-in method. Enable Email/Password in Authentication → Sign-in method.", "auth/weak-password": "Password must be at least 6 characters.", "auth/invalid-api-key": "Your Firebase API key is invalid. Copy the Web app config again.", "auth/invalid-project-id": "Your Firebase project ID is invalid.", "auth/network-request-failed": "Firebase could not connect. Check your internet connection.", "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.", "auth/configuration-not-found": "Firebase Authentication is not configured for this project." };
      setAuthError(messages[error.code] || `Firebase error: ${error.code || "unknown-error"}. Check the Firebase Console settings.`);
    }
  }

  async function logout() {
    if (auth && firebaseReady) await signOut(auth);
    setUserEmail("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#032b41]">
      <nav className="h-20 border-b border-[#eef2f1] bg-white"><div className="mx-auto flex h-full max-w-[1070px] items-center justify-between px-6"><Link href="/" className="text-2xl font-black tracking-[-0.06em]">summarist<span className="text-[#2bd97c]">.</span></Link><ul className="flex items-center gap-6 text-sm font-medium"><li>{displayEmail ? <button onClick={logout} className="hover:text-[#2bd97c]">Logout</button> : <button onClick={() => openAuth("login")} className="hover:text-[#2bd97c]">Login</button>}</li><li className="hidden cursor-not-allowed text-[#667276] sm:block">About</li><li className="hidden cursor-not-allowed text-[#667276] sm:block">Contact</li><li className="hidden cursor-not-allowed text-[#667276] sm:block">Help</li></ul></div></nav>
      +
      <section className="mx-auto max-w-[1070px] px-6 py-16 md:py-24"><div className="grid items-center gap-10 md:grid-cols-2"><div><h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-[#032b41] md:text-5xl">Gain more knowledge<br className="hidden md:block" /> in less time</h1><p className="mt-6 max-w-xl text-lg font-light leading-8 text-[#394547]">Great summaries for busy people, individuals who barely have time to read, and even people who don&apos;t like to read.</p><button onClick={() => openAuth("login")} className="mt-7 flex h-10 w-full max-w-[300px] items-center justify-center rounded bg-[#2bd97c] text-base text-[#032b41] transition-colors hover:bg-[#20ba68]">Login</button></div><div className="hidden justify-end md:flex"><div className="flex h-72 w-72 items-center justify-center rounded-full bg-[#d7e9ff] text-center text-7xl">📚</div></div></div></section>
      +
      <section className="bg-[#f1f6f4]"><div className="mx-auto max-w-[1070px] px-6 py-16"><h2 className="mb-10 text-center text-3xl font-bold text-[#032b41]">Understand books in few minutes</h2><div className="grid gap-10 md:grid-cols-3">{features.map(([icon, title, text]) => <div key={title} className="text-center"><div className="mb-3 text-5xl text-[#032b41]">{icon}</div><h3 className="mb-3 text-2xl font-medium">{title}</h3><p className="text-lg font-light text-[#394547]">{text}</p></div>)}</div></div></section>
      +
      <section><div className="mx-auto max-w-[1070px] px-6 py-16"><h2 className="mb-10 text-center text-3xl font-bold">What our members say</h2><div className="mx-auto grid max-w-2xl gap-5">{reviews.map(([name, text]) => <article key={name} className="rounded bg-[#fff3d7] p-5 text-[#394547]"><div className="mb-2 flex justify-between font-medium text-[#032b41]"><span>{name}</span><span className="text-[#0564f1]">★★★★★</span></div><p className="leading-6">{text}</p></article>)}</div><div className="mt-8 flex justify-center"><button onClick={() => openAuth("login")} className="h-10 min-w-[180px] rounded bg-[#2bd97c] px-6 text-[#032b41] hover:bg-[#20ba68]">Login</button></div></div></section>
      +
      <section className="bg-[#f1f6f4]"><div className="mx-auto max-w-[1070px] px-6 py-16"><h2 className="mb-10 text-center text-3xl font-bold">Start growing with Summarist now</h2><div className="grid gap-6 md:grid-cols-3">{stats.map(([title, text]) => <div key={title} className="rounded-xl bg-[#d7e9ff] p-6 text-center"><div className="mb-2 text-4xl font-semibold text-[#032b41]">{title}</div><p className="text-sm text-[#394547]">{text}</p></div>)}</div></div></section>
      +
      <footer className="bg-[#f1f6f4]"><div className="mx-auto grid max-w-[1070px] gap-8 border-t border-[#dce7e3] px-6 py-12 text-sm text-[#394547] sm:grid-cols-4"><div><h3 className="mb-4 font-semibold text-[#032b41]">Actions</h3><p>Summarist Magazine</p><p>Cancel Subscription</p><p>Help</p><p>Contact us</p></div><div><h3 className="mb-4 font-semibold text-[#032b41]">Useful Links</h3><p>Pricing</p><p>Summarist Business</p><p>Gift Cards</p><p>Authors &amp; Publishers</p></div><div><h3 className="mb-4 font-semibold text-[#032b41]">Company</h3><p>About</p><p>Careers</p><p>Partners</p><p>Code of Conduct</p></div><div><h3 className="mb-4 font-semibold text-[#032b41]">Other</h3><p>Sitemap</p><p>Legal Notice</p><p>Terms of Service</p><p>Privacy Policies</p></div></div><p className="pb-8 text-center text-sm font-medium text-[#032b41]">Copyright © 2023 Summarist.</p></footer>
      +
      {showAuth && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-[#032b41]/60 px-5" onClick={() => setShowAuth(false)}><form onSubmit={submitAuth} className="w-full max-w-md rounded bg-white p-8 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2bd97c]">{authMode === "login" ? "Welcome back" : "Create your account"}</p><h2 className="mt-2 text-3xl font-bold">{authMode === "login" ? "Log in" : "Create account"}</h2></div><button type="button" aria-label="Close login dialog" onClick={() => setShowAuth(false)} className="text-2xl">×</button></div><input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-8 w-full rounded border border-[#d5e0d6] px-4 py-3 outline-none focus:border-[#2bd97c]" type="email" placeholder="Email address" /><input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-3 w-full rounded border border-[#d5e0d6] px-4 py-3 outline-none focus:border-[#2bd97c]" type="password" placeholder="Password" />{authError && <p className="mt-3 text-sm font-semibold text-red-600">{authError}</p>}<button type="submit" className="mt-5 w-full rounded bg-[#2bd97c] py-3 font-bold text-[#032b41]">{authMode === "login" ? "Log in" : "Create account"}</button><button type="button" onClick={async () => { try { if (firebaseReady && auth) await signInAnonymously(auth); else setUserEmail("guest@summarist.demo"); setShowAuth(false); router.push("/for-you"); } catch { setAuthError("Guest login is not enabled in Firebase."); } }} className="mt-3 w-full rounded border border-[#032b41] py-3 font-bold">Continue as guest</button><p className="mt-5 text-center text-sm text-[#667276]">{authMode === "login" ? "New here?" : "Already have an account?"} <button type="button" onClick={() => openAuth(authMode === "login" ? "register" : "login")} className="font-bold text-[#0564f1]">{authMode === "login" ? "Create an account" : "Log in"}</button></p></form></div>}
    </main>
  );
}
