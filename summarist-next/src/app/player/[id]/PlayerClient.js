"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function PlayerClient({ book }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    function updateProgress() {
      setCurrentTime(audio.currentTime);
    }

    function updateDuration() {
      setDuration(audio.duration);
    }

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  }

  function skip(seconds) {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + seconds);
  }

  function seek(event) {
    if (audioRef.current) audioRef.current.currentTime = Number(event.target.value);
  }

  return (
    <section className="mt-10 rounded-[2rem] bg-[#213f38] p-6 text-white shadow-xl sm:p-10">
      {book.audioLink && <audio ref={audioRef} src={book.audioLink} preload="metadata" />}
      <div className="flex items-center justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f7c7a8]">Now playing</p><h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">{book.title}</h2></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">Audio summary</span></div>
      <div className="mt-8"><input aria-label="Audio progress" type="range" min="0" max={duration || 0} value={currentTime} onChange={seek} disabled={!book.audioLink} className="h-1.5 w-full accent-[#ec6f4e] disabled:opacity-40" /><div className="mt-2 flex justify-between text-xs text-white/55"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div></div>
      <div className="mt-8 flex items-center justify-center gap-5"><button aria-label="Skip back 15 seconds" onClick={() => skip(-15)} className="rounded-full p-3 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white">-15</button><button aria-label={isPlaying ? "Pause audio" : "Play audio"} onClick={togglePlayback} disabled={!book.audioLink} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ec6f4e] text-xl font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50">{isPlaying ? "Ⅱ" : "▶"}</button><button aria-label="Skip forward 15 seconds" onClick={() => skip(15)} className="rounded-full p-3 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white">+15</button></div>
      {!book.audioLink && <p className="mt-6 text-center text-sm text-white/55">Audio will be available when this title is connected to its source file.</p>}
    </section>
  );
}
