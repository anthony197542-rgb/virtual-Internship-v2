"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "../../components/AppShell";

const plans = {
  monthly: { price: "$9.99", period: "month", note: "Billed monthly" },
  yearly: { price: "$6.99", period: "month", note: "Billed annually · 7-day free trial" },
};

const faqs = [
  ["Can I cancel anytime?", "Yes. You can cancel your subscription at any time from your account settings."],
  ["What do I get with Premium?", "Premium unlocks the full library, including premium book summaries and audio versions."],
  ["Can I switch plans?", "You can change your billing preference whenever you like. The new plan starts on your next billing cycle."],
];

export default function ChoosePlanPage() {
  const [billing, setBilling] = useState("yearly");
  const [openFaq, setOpenFaq] = useState(0);
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const plan = plans[billing];

  async function startCheckout() {
    setCheckoutError("");
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/create-checkout-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ billing }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not start.");
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error.message);
      setIsCheckingOut(false);
    }
  }

  return (
    <AppShell>
      <main className="min-h-screen bg-white px-6 py-5 text-[#173f35] lg:px-10">
        <div className="mx-auto max-w-[920px]">
          <div className="flex items-end justify-between border-b border-[#e5ebe8] pb-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#ec6f4e]">Premium access</p><h1 className="mt-1 text-[17px] font-bold tracking-[-0.02em]">Choose your plan</h1><p className="mt-1 text-[10px] text-[#78918a]">Unlock every summary and listen without limits.</p></div><Link href="/for-you" className="text-[10px] font-bold text-[#ec6f4e]">Back to For you</Link></div>
          <div className="mx-auto mt-4 flex w-fit rounded-md border border-[#dbe5db] bg-[#f7f9f8] p-1"><button onClick={() => setBilling("monthly")} className={`rounded px-3 py-1.5 text-[10px] font-bold ${billing === "monthly" ? "bg-[#173f35] text-white" : "text-[#78918a]"}`}>Monthly</button><button onClick={() => setBilling("yearly")} className={`rounded px-3 py-1.5 text-[10px] font-bold ${billing === "yearly" ? "bg-[#ec6f4e] text-white" : "text-[#78918a]"}`}>Yearly <span className="ml-1">Save 30%</span></button></div>
          <section className="mx-auto mt-4 grid max-w-[780px] gap-3 md:grid-cols-2"><div className="rounded-lg border border-[#dbe5db] bg-[#fbfcfb] p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#78918a]">Basic</p><h2 className="mt-2 text-[15px] font-bold tracking-[-0.02em]">The essentials</h2><p className="mt-1 text-[10px] leading-4 text-[#78918a]">Start with a curated selection of summaries.</p><ul className="mt-3 grid gap-1.5 text-[10px] font-semibold"><li>✓ Selected free titles</li><li>✓ Read summaries</li><li>✓ Personal recommendations</li></ul><button className="mt-5 w-full rounded-md border border-[#173f35] py-2 text-[10px] font-bold">Current plan</button></div><div className="relative rounded-lg border-2 border-[#ec6f4e] bg-[#fff9f5] p-4"><span className="absolute right-3 top-3 rounded bg-[#f7c7a8] px-1.5 py-1 text-[7px] font-black uppercase tracking-wider text-[#173f35]">Most popular</span><p className="text-[9px] font-bold uppercase tracking-wider text-[#ec6f4e]">Premium</p><h2 className="mt-2 text-[15px] font-bold tracking-[-0.02em]">The full library</h2><p className="mt-1 text-[10px] leading-4 text-[#78918a]">Everything you need to keep learning.</p><div className="mt-3 flex items-baseline gap-1"><span className="text-2xl font-bold tracking-[-0.04em]">{plan.price}</span><span className="text-[9px] text-[#78918a]">/{plan.period}</span></div><p className="mt-1 text-[9px] font-semibold text-[#ec6f4e]">{plan.note}</p><ul className="mt-3 grid gap-1.5 text-[10px] font-semibold"><li>✓ Full book library</li><li>✓ Audio and text summaries</li><li>✓ Save books to your library</li></ul><button onClick={startCheckout} disabled={isCheckingOut} className="mt-5 w-full rounded-md bg-[#173f35] py-2 text-[10px] font-bold text-white disabled:cursor-wait disabled:opacity-60">{isCheckingOut ? "Preparing checkout..." : "Continue with Premium"}</button>{checkoutError && <p className="mt-2 text-[10px] font-semibold text-[#c5543e]">{checkoutError}</p>}</div></section>
          <section className="mx-auto mt-7 max-w-[780px] border-t border-[#e5ebe8] pt-4"><h2 className="text-[15px] font-bold tracking-[-0.02em]">Questions, answered.</h2><div className="mt-2 divide-y divide-[#e5ebe8] border-y border-[#e5ebe8]">{faqs.map(([question, answer], index) => <div key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between py-2.5 text-left text-[10px] font-bold"><span>{question}</span><span className="text-sm text-[#ec6f4e]">{openFaq === index ? "−" : "+"}</span></button>{openFaq === index && <p className="max-w-2xl pb-2.5 text-[10px] leading-4 text-[#78918a]">{answer}</p>}</div>)}</div></section>
        </div>
      </main>
    </AppShell>
  );
}
