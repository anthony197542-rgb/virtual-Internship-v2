"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { saveBook } from "../../../lib/library";

export default function BookActions({ book }) {
  const { user, firebaseReady } = useAuth();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function addToLibrary() {
    if (!user) {
      setMessage("Log in before saving books to your library.");
      return;
    }
    if (!firebaseReady) {
      setMessage("Add Firebase settings to enable library saving.");
      return;
    }
    setSaving(true);
    try {
      await saveBook(user.uid, { id: book.id, title: book.title, author: book.author, subTitle: book.subTitle, imageLink: book.imageLink || "" });
      setMessage("Added to your library.");
    } catch {
      setMessage("Could not save this book. Check your Firestore rules.");
    } finally {
      setSaving(false);
    }
  }

  return <div><div className="mt-9 flex flex-wrap gap-3"><Link href={`/player/${book.id}`} className="rounded-full bg-[#ec6f4e] px-6 py-3.5 text-sm font-bold text-white">Read or listen <span aria-hidden="true">→</span></Link><button onClick={addToLibrary} disabled={saving} className="rounded-full border border-[#173f35] px-6 py-3.5 text-sm font-bold hover:bg-[#173f35] hover:text-white disabled:opacity-50">{saving ? "Saving..." : "+ Add to My Library"}</button></div>{message && <p className="mt-3 text-sm font-semibold text-[#ec6f4e]">{message}</p>}</div>;
}
