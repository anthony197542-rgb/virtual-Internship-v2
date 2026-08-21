"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

const API_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks";

export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooksData() {
      try {
        // Fetching books for each status category from your Firebase cloud function
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch(`${API_URL}?status=selected`).then(res => res.json()),
          fetch(`${API_URL}?status=recommended`).then(res => res.json()),
          fetch(`${API_URL}?status=suggested`).then(res => res.json()),
        ]);

        setSelectedBook(Array.isArray(selectedRes) ? selectedRes[0] : selectedRes);
        setRecommended(recommendedRes || []);
        setSuggested(suggestedRes || []);
      } catch (error) {
        console.error("Failed to fetch books, using fallbacks", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooksData();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg font-bold text-[#173f35]">Loading...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="min-h-screen bg-white text-[#173f35]">
        <div className="mx-auto max-w-[920px] px-8 py-7 lg:px-10 lg:py-8">
          <h1 className="text-[17px] font-bold tracking-[-0.02em]">Selected just for you</h1>

          {selectedBook && (
            <section className="mt-3 flex min-h-[128px] items-center overflow-hidden bg-[#fff4d5] px-5 py-4">
              <div className="w-[34%] pr-4 text-[13px] font-semibold leading-tight text-[#304943]">
                {selectedBook.subTitle || "How constant innovation creates radically successful businesses"}
              </div>
              <div className="h-[94px] w-[1px] bg-[#e6d9b7]" />
              <Link href={`/book/${selectedBook.id}`} className="mx-6 h-[94px] w-[66px] shrink-0 overflow-hidden rounded-sm bg-[#193f87] shadow-sm">
                <BookArtwork book={selectedBook} featured />
              </Link>
              <div className="min-w-0">
                <h2 className="text-[14px] font-bold text-[#273e38]">{selectedBook.title}</h2>
                <p className="mt-1 text-[11px] text-[#687873]">{selectedBook.author}</p>
                <Link href={`/player/${selectedBook.id}`} className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#253e38]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">▶</span>3 min 23 secs
                </Link>
              </div>
            </section>
          )}

          <BookRow title="Recommended For You" books={recommended} />
          <BookRow title="Suggested for you" books={suggested} />
        </div>
      </main>
    </AppShell>
  );
}

function BookArtwork({ book, featured = false }) {
  return book?.imageLink ? (
    <img src={book.imageLink} alt={book.title} className="h-full w-full object-cover" />
  ) : (
    <div className={`flex h-full w-full flex-col justify-between bg-[#213f38] p-5 text-white ${featured ? "min-h-[330px]" : "min-h-[220px]"}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7c7a8]">summarist.</span>
      <div>
        <p className="text-3xl font-black leading-[0.92] tracking-[-0.06em]">{book?.title}</p>
        <p className="mt-3 text-sm text-white/65">{book?.author}</p>
      </div>
    </div>
  );
}

function BookCard({ book }) {
  return (
    <Link href={`/book/${book.id}`} className="group block min-w-[125px] flex-1">
      <div className="relative aspect-[0.72] overflow-hidden rounded-[2px] bg-[#d7e7d9] shadow-sm transition-transform group-hover:-translate-y-1 group-hover:shadow-lg">
        <BookArtwork book={book} />
        {book.subscriptionRequired && <span className="absolute bottom-0 left-0 bg-[#f5d35d] px-2 py-1 text-[9px] font-bold text-[#173f35]">Premium</span>}
      </div>
      <h3 className="mt-2 text-[12px] font-bold leading-tight text-[#253e38]">{book.title}</h3>
      <p className="mt-1 text-[10px] leading-tight text-[#71837e]">{book.author}</p>
      <p className="mt-1 text-[10px] text-[#8b9995]">◷ 03:24 ☆ 4.3</p>
    </Link>
  );
}

function BookRow({ title, books }) {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-black tracking-[-0.05em]">{title}</h2>
        <span className="text-xs font-bold uppercase tracking-wider text-[#ec6f4e]">Explore all</span>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}