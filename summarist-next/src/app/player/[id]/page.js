import Link from "next/link";
import PlayerClient from "./PlayerClient";
import AppShell from "../../../components/AppShell";

const API_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

async function getBook(id) {
  try {
    const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Book request failed");
    const payload = await response.text();
    if (!payload.trim()) throw new Error("Book response was empty");
    return JSON.parse(payload);
  } catch {
    return {
      id,
      title: id === "think-again" ? "Think Again" : "Your next great idea",
      author: "Adam Grant",
      summary: "The best thinkers are not defined by how often they are right. They are defined by how willing they are to revisit what they believe.\n\nThink again is an invitation to stay curious, question comfortable assumptions, and make learning a daily practice.",
      audioLink: "",
    };
  }
}

export default async function PlayerPage({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <AppShell>
      <main className="min-h-screen bg-[#f7f7f2] text-[#173f35]">
        <header className="border-b border-[#dbe5db] bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6"><Link href={`/book/${book.id}`} className="text-sm font-bold text-[#78918a] hover:text-[#ec6f4e]">← Book details</Link><Link href="/" className="text-2xl font-black tracking-[-0.06em]">summarist<span className="text-[#ec6f4e]">.</span></Link><Link href="/for-you" className="text-sm font-semibold hover:text-[#ec6f4e]">For you</Link></div></header>
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ec6f4e]">Focused listening</p><h1 className="mt-3 text-5xl font-black tracking-[-0.07em] sm:text-7xl">{book.title}</h1><p className="mt-4 text-lg text-[#78918a]">A summary by {book.author}</p><PlayerClient book={book} /><section className="mt-16 max-w-3xl"><h2 className="text-3xl font-black tracking-[-0.05em]">Summary</h2><p className="mt-6 whitespace-pre-line text-lg leading-9 text-[#55716a]">{book.summary}</p></section></div>
      </main>
    </AppShell>
  );
}
