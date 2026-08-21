"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "../../components/AppShell";

export default function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppShell>
      <main className="min-h-screen bg-[#f7f7f2] text-[#173f35]">
        <header className="border-b border-[#dbe5db] bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6"><Link href="/for-you" className="text-2xl font-black tracking-[-0.06em]">summarist<span className="text-[#ec6f4e]">.</span></Link><Link href="/" className="text-sm font-semibold hover:text-[#ec6f4e]">Log out</Link></div></header>
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ec6f4e]">Your account</p><h1 className="mt-3 text-5xl font-black tracking-[-0.07em]">Settings</h1>
          {!isLoggedIn ? <section className="mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] bg-white px-6 text-center shadow-sm"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1c6a9] text-2xl">✦</div><h2 className="mt-6 text-3xl font-black tracking-[-0.05em]">Your account lives here.</h2><p className="mt-4 max-w-md leading-7 text-[#78918a]">Log in to see your subscription, manage your plan, and keep your reading journey in one place.</p><button onClick={() => setIsLoggedIn(true)} className="mt-8 rounded-full bg-[#173f35] px-7 py-3.5 text-sm font-bold text-white">Log in</button></section> : <section className="mt-12 grid gap-6 md:grid-cols-[1.25fr_0.75fr]"><div className="rounded-[2rem] bg-white p-8 shadow-sm"><div className="flex items-start justify-between gap-5"><div><p className="text-sm font-bold text-[#78918a]">Signed in as</p><p className="mt-2 text-xl font-black">guest@summarist.demo</p></div><span className="rounded-full bg-[#d7e7d9] px-3 py-1.5 text-xs font-bold uppercase tracking-wider">Active</span></div><div className="mt-10 border-t border-[#dbe5db] pt-8"><p className="text-sm font-bold text-[#78918a]">Current plan</p><div className="mt-3 flex items-end justify-between gap-5"><div><h2 className="text-3xl font-black tracking-[-0.05em]">Basic</h2><p className="mt-2 text-sm text-[#78918a]">Free access to selected titles</p></div><Link href="/choose-plan" className="rounded-full bg-[#ec6f4e] px-5 py-3 text-sm font-bold text-white">Upgrade</Link></div></div></div><div className="rounded-[2rem] bg-[#213f38] p-8 text-white"><p className="text-sm font-bold text-[#f7c7a8]">Keep learning</p><h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em]">A better habit starts with one page.</h2><Link href="/for-you" className="mt-8 inline-block rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173f35]">Browse books</Link></div><button onClick={() => setIsLoggedIn(false)} className="text-left text-sm font-bold text-[#c5543e] hover:underline">Log out of this demo account</button></section>}
        </div>
      </main>
    </AppShell>
  );
}
