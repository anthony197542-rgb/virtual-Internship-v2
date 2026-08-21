"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { getSavedBooks } from "../../lib/library";

const demoBooks = [
  { id: "atomic-habits", title: "Atomic Habits", author: "James Clear", detail: "Small changes, remarkable results" },
  { id: "deep-work", title: "Deep Work", author: "Cal Newport", detail: "Rules for focused success" },
];

function LibraryBook({ book }) {
  return <Link href={`/book/${book.id}`} className="group flex items-center gap-5 rounded-2xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5"><div className="flex h-28 w-20 shrink-0 flex-col justify-between rounded-xl bg-[#213f38] p-3 text-white"><span className="text-[8px] font-bold uppercase tracking-widest text-[#f7c7a8]">summarist.</span><span className="text-sm font-black leading-none">{book.title}</span></div><div><h3 className="text-xl font-black tracking-[-0.04em] group-hover:text-[#ec6f4e]">{book.title}</h3><p className="mt-1 font-semibold text-[#55716a]">{book.author}</p><p className="mt-3 text-sm text-[#78918a]">{book.subTitle || book.detail}</p></div><span className="ml-auto text-xl text-[#ec6f4e]">→</span></Link>;
}

function EmptyState({ title, text }) {
  return <div className="rounded-2xl border border-dashed border-[#cddbcf] px-6 py-12 text-center"><p className="text-2xl font-black tracking-[-0.04em]">{title}</p><p className="mx-auto mt-3 max-w-sm leading-7 text-[#78918a]">{text}</p><Link href="/for-you" className="mt-6 inline-block rounded-full bg-[#173f35] px-5 py-3 text-sm font-bold text-white">Find a book</Link></div>;
}

export default function LibraryClient() {
  const { user, firebaseReady } = useAuth();
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadBooks() {
      if (!user || !firebaseReady) {
        setLoading(false);
        return;
      }
      const books = await getSavedBooks(user.uid);
      if (active) {
        setSavedBooks(books);
        setLoading(false);
      }
    }
    loadBooks();
    return () => { active = false; };
  }, [user, firebaseReady]);

  const books = firebaseReady ? savedBooks : demoBooks;

  return <main className="min-h-screen bg-[#f7f7f2] px-6 py-12 text-[#173f35] lg:px-10 lg:py-16"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ec6f4e]">Your collection</p><h1 className="mt-3 text-5xl font-black tracking-[-0.07em]">My library</h1><p className="mt-4 text-lg text-[#78918a]">Keep the ideas you want to return to.</p><section className="mt-14"><div className="mb-6 flex items-center justify-between"><h2 className="text-3xl font-black tracking-[-0.05em]">Saved books</h2><span className="rounded-full bg-[#d7e7d9] px-3 py-1.5 text-xs font-bold">{books.length} titles</span></div>{loading ? <div className="h-32 animate-pulse rounded-2xl bg-[#e4ede3]" /> : <div className="grid gap-4 md:grid-cols-2">{books.length ? books.map((book) => <LibraryBook key={book.id} book={book} />) : <EmptyState title="Nothing saved yet" text="When a title catches your attention, add it here for easy access." />}</div>}</section><section className="mt-16 border-t border-[#dbe5db] pt-12"><h2 className="text-3xl font-black tracking-[-0.05em]">Finished books</h2><div className="mt-6"><EmptyState title="Your finished shelf is waiting" text="Complete your first summary and it will appear here." /></div></section></div></main>;
}
