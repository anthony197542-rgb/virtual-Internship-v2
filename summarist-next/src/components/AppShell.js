"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const searchUrl = "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=";

export default function AppShell({ children }) {
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!search.trim()) {
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${searchUrl}${encodeURIComponent(search.trim())}`);
        if (!response.ok) throw new Error("Search failed");
        const payload = await response.text();
        setResults(payload.trim() ? JSON.parse(payload) : []);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);
    if (!value.trim()) setResults([]);
  }

  return (
    <div className="min-h-screen bg-white md:pl-[126px]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[126px] flex-col border-r border-[#e6e9e8] bg-[#f8faf9] px-3 py-7 md:flex"><Link href="/" className="text-center text-[19px] font-black tracking-[-0.07em] text-[#173f35]">summarist<span className="text-[#ec6f4e]">.</span></Link><nav className="mt-10 grid gap-2 text-[12px] font-semibold text-[#52635f]"><Link href="/for-you" className="flex flex-col items-center gap-2 rounded-lg bg-[#e8f0eb] px-2 py-3 text-[#173f35]"><span className="text-lg">⌂</span>For you</Link><Link href="/library" className="flex flex-col items-center gap-2 rounded-lg px-2 py-3 hover:bg-[#e8f0eb]"><span className="text-lg">▱</span>My Library</Link><span className="flex cursor-not-allowed flex-col items-center gap-2 rounded-lg px-2 py-3 text-[#9ca9a5]"><span className="text-lg">✎</span>Highlights</span><span className="flex cursor-not-allowed flex-col items-center gap-2 rounded-lg px-2 py-3 text-[#9ca9a5]"><span className="text-lg">⌕</span>Search</span></nav><nav className="mt-auto grid gap-2 text-[12px] font-semibold text-[#52635f]"><Link href="/settings" className="flex flex-col items-center gap-2 rounded-lg px-2 py-3 hover:bg-[#e8f0eb]"><span className="text-lg">⚙</span>Settings</Link><span className="flex cursor-not-allowed flex-col items-center gap-2 rounded-lg px-2 py-3 text-[#9ca9a5]"><span className="text-lg">?</span>Help &amp; Support</span><button onClick={logout} className="flex flex-col items-center gap-2 rounded-lg px-2 py-3 text-[#52635f] hover:bg-[#fff0eb] hover:text-[#c5543e]"><span className="text-lg">↪</span>Logout</button></nav></aside>
      <div className="border-b border-[#edf0ef] bg-white px-5 py-4 md:px-10"><div className="mx-auto flex max-w-[710px] items-center gap-4"><Link href="/" className="text-xl font-black tracking-[-0.06em] md:hidden">s<span className="text-[#ec6f4e]">.</span></Link><div className="relative w-full"><input value={search} onChange={handleSearchChange} placeholder="Search for books" className="h-10 w-full rounded-lg border border-[#dfe6e3] bg-[#f7f9f8] px-4 text-[11px] outline-none focus:border-[#8ca99b]" /><span className="pointer-events-none absolute right-3 top-2 text-lg text-[#52726a]">⌕</span>{results.length > 0 && <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border border-[#dbe5db] bg-white p-2 shadow-xl">{results.slice(0, 5).map((book) => <Link key={book.id} href={`/book/${book.id}`} onClick={() => { setSearch(""); setResults([]); }} className="block rounded-lg px-4 py-3 hover:bg-[#f7f7f2]"><p className="font-bold">{book.title}</p><p className="text-xs text-[#78918a]">{book.author}</p></Link>)}</div>}</div></div></div>
      <div>{children}</div>
    </div>
  );
}
