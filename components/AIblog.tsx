"use client"

import { useState } from "react"
import Link from "next/link"

type Status = "idle" | "loading" | "success" | "error"

const SUGGESTED_TOPICS = [
  "The divine significance of Radha Krishna idols in home décor",
  "Why Hanuman Ji statues bring protection and courage",
  "Brass vs marble idols — which is right for your puja room?",
  "The spiritual meaning of Ganesha in handicraft art",
  "How to set up a sacred puja space at home",
]

export default function GenerateBlogPage() {
  const [topic, setTopic]   = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<{ title: string; slug: string } | null>(null)
  const [error, setError]   = useState("")
  const [history, setHistory] = useState<{ title: string; slug: string }[]>([])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setStatus("loading")
    setError("")
    setResult(null)

    try {
      const res  = await fetch("/api/generate-blog", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ topic }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Generation failed")
      setResult(data)
      setHistory((prev) => [data, ...prev].slice(0, 5))
      setStatus("success")
      setTopic("")
    } catch (e: any) {
      setError(e.message)
      setStatus("error")
    }
  }

  const isLoading = status === "loading"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif !important; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#f9f7f4]">

        {/* ── Header ── */}
        <header className="border-b border-stone-200 bg-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-white text-sm">✦</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-700">
                Radha Rani Handicrafts
              </p>
              <p className="text-[11px] text-stone-400">Admin Panel</p>
            </div>
          </div>
          <Link
            href="/blog"
            className="text-[11px] font-semibold tracking-[0.1em] uppercase text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            View Blog →
          </Link>
        </header>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 grid lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── Main card ── */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">

            {/* Card header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-8 py-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">🤖</span>
                <h1 className="font-serif text-3xl font-bold text-stone-900">AI Blog Generator</h1>
              </div>
              <p className="text-sm text-stone-500 ml-11">
                Enter a topic and AI will write and publish a full blog post to Sanity
              </p>
            </div>

            <div className="px-8 py-7 space-y-6">

              {/* Topic input */}
              <div>
                <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600 block mb-2">
                  Blog Topic
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The significance of Radha Krishna idols in home décor"
                  rows={4}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
                  }}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none transition-all disabled:opacity-50 disabled:bg-stone-50"
                />
                <p className="mt-1.5 text-[11px] text-stone-400">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">⌘ Enter</kbd> to generate
                </p>
              </div>

              {/* Suggested topics */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-400 mb-2">
                  Suggested Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      disabled={isLoading}
                      className="text-[12px] px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-800 hover:bg-amber-50 transition-all disabled:opacity-40"
                    >
                      {t.length > 45 ? t.slice(0, 45) + "…" : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="w-full relative overflow-hidden bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating — this may take 15–30s…
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Generate Blog Post
                  </>
                )}
              </button>

              {/* Loading steps */}
              {isLoading && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 space-y-2">
                  {[
                    "Calling AI model…",
                    "Structuring blog content…",
                    "Converting to Sanity blocks…",
                    "Publishing to Sanity…",
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-2.5">
                      <svg className={`animate-spin w-3 h-3 text-amber-500 ${i > 0 ? "opacity-40" : ""}`} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className={`text-[13px] ${i === 0 ? "text-amber-800 font-medium" : "text-amber-500"}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Success */}
              {status === "success" && result && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-5 py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[11px]">✓</span>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-green-700">
                      Published to Sanity
                    </p>
                  </div>
                  <p className="font-serif text-lg font-semibold text-stone-900 mb-4 leading-snug">
                    {result.title}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href={`/blog/${result.slug}`}
                      className="flex-1 text-center text-[12px] font-bold tracking-wide uppercase bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors"
                    >
                      View Post →
                    </Link>
                    <a
                      href={`${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio"}/desk/post`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-[12px] font-bold tracking-wide uppercase border border-stone-200 text-stone-600 hover:border-stone-400 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Open in Studio
                    </a>
                  </div>
                </div>
              )}

              {/* Error */}
              {status === "error" && error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[11px]">✕</span>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-red-600">Error</p>
                  </div>
                  <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                  <button
                    onClick={handleGenerate}
                    className="mt-3 text-[12px] font-bold tracking-wide uppercase text-red-600 hover:text-red-800 transition-colors"
                  >
                    Try again →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-stone-500 mb-4">
                How it works
              </h2>
              <div className="space-y-4">
                {[
                  { step: "1", label: "Enter a topic", desc: "Type any spiritual or handicraft topic" },
                  { step: "2", label: "AI writes content", desc: "GPT-4o-mini generates structured JSON blog" },
                  { step: "3", label: "Auto-published", desc: "Converted to Sanity blocks and saved instantly" },
                  { step: "4", label: "Live on blog", desc: "Post is immediately visible on your blog" },
                ].map(({ step, label, desc }) => (
                  <div key={step} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center">
                      {step}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-stone-800">{label}</p>
                      <p className="text-[12px] text-stone-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent posts */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-stone-500 mb-4">
                  Recently Generated
                </h2>
                <div className="space-y-3">
                  {history.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <p className="text-[13px] font-medium text-stone-700 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">/blog/{post.slug}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Info box */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-[12px] text-amber-800 leading-relaxed">
                <strong className="font-semibold">Note:</strong> Posts are published as drafts in Sanity.
                Review and add a featured image in{" "}
                <a href="/studio" target="_blank" className="underline font-semibold hover:text-amber-900">
                  Sanity Studio
                </a>{" "}
                before sharing publicly.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}