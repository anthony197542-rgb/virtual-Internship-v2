import Link from "next/link";
import AppShell from "../../../components/AppShell";
import BookActions from "./BookActions";

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
      title: id === "think-again" ? "Think Again" : "A better way to spend your time",
      author: id === "think-again" ? "Adam Grant" : "Summarist editorial team",
      subTitle: "The ideas worth carrying with you",
      summary: "Great ideas become useful when we make space for them. This summary gives you a focused path through the book, highlighting the key lessons and the practical questions that help turn insight into action.\n\nTake your time with each idea. Return to the ones that feel useful, and let the rest create a little productive friction.",
      bookDescription: "A concise guide to the most important ideas in this title.",
      authorDescription: "An author exploring how better questions can lead to better decisions.",
      keyIdeas: ["Stay curious when your assumptions are challenged.", "Make learning an active, repeatable habit.", "Use reflection to turn information into action."],
      subscriptionRequired: false,
      type: "audio & text",
      averageRating: 4.8,
      totalRating: 128,
      imageLink: "",
    };
  }
}

function BookArtwork({ book }) {
  return book.imageLink ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={book.imageLink} alt={book.title} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full min-h-[330px] w-full flex-col justify-between bg-[#213f38] p-7 text-white"><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f7c7a8]">summarist.</span><div><p className="text-5xl font-black leading-[0.88] tracking-[-0.07em]">{book.title}</p><p className="mt-5 text-sm text-white/65">{book.author}</p></div><span className="text-xs uppercase tracking-[0.18em] text-white/55">Book summary</span></div>
  );
}

export default async function BookPage({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  const ideas = Array.isArray(book.keyIdeas) ? book.keyIdeas : [];

  return (
    <AppShell>
      <main className="min-h-screen bg-[#f7f7f2] text-[#173f35]">
        <header className="border-b border-[#dbe5db] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"><Link href="/for-you" className="text-sm font-bold text-[#78918a] hover:text-[#ec6f4e]">← Back to For you</Link><Link href="/" className="text-2xl font-black tracking-[-0.06em]">summarist<span className="text-[#ec6f4e]">.</span></Link><Link href="/settings" className="text-sm font-semibold hover:text-[#ec6f4e]">Settings</Link></div></header>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <section className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
            <div className="relative aspect-[0.72] overflow-hidden rounded-[1.5rem] bg-[#d7e7d9] shadow-xl"><BookArtwork book={book} />{book.subscriptionRequired && <span className="absolute right-4 top-4 rounded-full bg-[#f7c7a8] px-3 py-1.5 text-xs font-bold uppercase tracking-wider">Premium</span>}</div>
            <div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ec6f4e]">{book.type || "Audio & text"}</p><h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-7xl">{book.title}</h1><p className="mt-5 text-xl text-[#55716a]">{book.subTitle}</p><p className="mt-4 font-semibold">{book.author}</p><div className="mt-5 flex items-center gap-3 text-sm text-[#78918a]"><span className="font-bold text-[#173f35]">★ {book.averageRating || "4.8"}</span><span>from {book.totalRating || 100} ratings</span></div><BookActions book={book} /></div>
          </section>

          <section className="mt-20 grid gap-12 border-t border-[#dbe5db] pt-12 lg:grid-cols-[1.2fr_0.8fr]"><div><h2 className="text-3xl font-black tracking-[-0.05em]">Key ideas</h2><div className="mt-6 grid gap-4">{ideas.map((idea, index) => <div key={idea} className="flex gap-4 rounded-2xl bg-white p-5"><span className="font-black text-[#ec6f4e]">0{index + 1}</span><p className="font-semibold leading-7">{idea}</p></div>)}</div></div><div><h2 className="text-3xl font-black tracking-[-0.05em]">About this book</h2><p className="mt-6 leading-8 text-[#55716a]">{book.bookDescription}</p><h3 className="mt-10 text-xl font-black">About the author</h3><p className="mt-4 leading-8 text-[#55716a]">{book.authorDescription}</p></div></section>
        </div>
      </main>
    </AppShell>
  );
}
