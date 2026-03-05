"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  featuredImage?: any;
  publishedAt?: string;
  category?: string;
  readTime?: number;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  metaDescription?: string;
  featuredImage?: any;
  publishedAt?: string;
  category?: string;
  readTime?: number;
  content?: any[];
  author?: { name: string; image?: any; bio?: any[] };
  relatedPosts?: RelatedPost[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getBlockText(block: any): string {
  return (block?.children ?? []).map((c: any) => c.text ?? "").join("");
}
function getBlockStyle(block: any): string {
  return block?.style ?? "normal";
}
function isListItem(block: any): boolean {
  return !!block?.listItem;
}
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── Link placeholder parser ──────────────────────────────────────────────────
const LINK_RE = /\[LINK\s+text=['"]([^'"]+)['"]\s+href=['"]([^'"]*)['"]\]/g;

function parseLinkPlaceholders(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let idx = 0;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last)
      parts.push(<span key={`t${idx}`}>{text.slice(last, match.index)}</span>);
    const href = match[2] || "#";
    const isExternal = href.startsWith("http");
    parts.push(
      <a
        key={`l${idx}`}
        href={href === "#" ? undefined : href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={
          href === "#"
            ? "text-amber-600 underline decoration-dashed decoration-amber-300 underline-offset-2 cursor-not-allowed opacity-60"
            : "text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-900 transition-colors"
        }
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
    idx++;
  }
  if (last < text.length)
    parts.push(<span key={`tend${idx}`}>{text.slice(last)}</span>);
  return parts.length === 0 ? text : <>{parts}</>;
}

function blockHasLinkPlaceholders(block: any): boolean {
  const joined = getBlockText(block);
  LINK_RE.lastIndex = 0;
  return LINK_RE.test(joined);
}

function RenderBlockWithPlaceholders({
  block,
  Tag = "p",
  className,
}: {
  block: any;
  Tag?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const fullText = getBlockText(block);
  // @ts-ignore
  return <Tag className={className}>{parseLinkPlaceholders(fullText)}</Tag>;
}

function RenderSpan({ span, markDefs }: { span: any; markDefs?: any[] }) {
  if (typeof span.text === "string" && span.text.includes("[LINK "))
    return <>{parseLinkPlaceholders(span.text)}</>;
  let content: React.ReactNode = span.text;
  if (span.marks?.includes("strong"))
    content = <strong className="font-semibold text-stone-900">{content}</strong>;
  if (span.marks?.includes("em")) content = <em className="italic">{content}</em>;
  if (span.marks?.includes("underline")) content = <u>{content}</u>;
  const linkMark = span.marks?.find((m: string) =>
    markDefs?.some((d: any) => d._key === m && d._type === "link")
  );
  if (linkMark && markDefs) {
    const def = markDefs.find((d: any) => d._key === linkMark);
    if (def?.href) {
      const isExternal = def.href.startsWith("http") || def.blank;
      content = (
        <a
          href={def.href}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-900 transition-colors"
        >
          {content}
        </a>
      );
    }
  }
  return <>{content}</>;
}

function RenderChildren({ children, markDefs }: { children: any[]; markDefs?: any[] }) {
  return (
    <>
      {(children ?? []).map((span: any, i: number) => (
        <RenderSpan key={span._key ?? i} span={span} markDefs={markDefs} />
      ))}
    </>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex gap-4 items-start py-5 text-left group min-h-[48px]"
        aria-expanded={open}
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200">
          {index + 1}
        </span>
        <span className="flex-1 text-stone-800 font-medium text-[15px] leading-snug pt-0.5">
          {question}
        </span>
        <svg
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`flex-shrink-0 mt-1 text-stone-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pb-5 pl-11">
          <p className="text-stone-600 text-[15px] leading-[1.85]">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Block Renderer ────────────────────────────────────────────────────────────
function RenderBlocks({ blocks }: { blocks: any[] }) {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (block._type !== "block") { i++; continue; }

    const style = getBlockStyle(block);
    const text = getBlockText(block);

    // FAQ detection
    if ((style === "h2" || style === "h3") && text.toLowerCase().includes("frequently asked")) {
      const faqPairs: { question: string; answer: string }[] = [];
      let j = i + 1;
      while (j < blocks.length) {
        const next = blocks[j];
        if (next._type !== "block") break;
        const nextStyle = getBlockStyle(next);
        const nextText = getBlockText(next);
        if (nextStyle === "h2" || nextStyle === "h3") break;
        const match = nextText.match(/^Q:\s*(.+?)\s{2,}A:\s*(.+)$/s);
        if (match) { faqPairs.push({ question: match[1].trim(), answer: match[2].trim() }); j++; continue; }
        if (nextStyle === "normal" && !nextText.startsWith("Q:")) break;
        j++;
      }
      if (faqPairs.length > 0) {
        nodes.push(
          <section key={`faq-${i}`} aria-label="FAQ" className="my-12 rounded-2xl border border-amber-100 bg-white overflow-hidden shadow-sm">
            <div className="px-6 sm:px-7 py-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-3">
              <span className="text-xl" aria-hidden>🙏</span>
              <h2 className="font-serif text-xl font-bold text-stone-900">Frequently Asked Questions</h2>
            </div>
            <div className="px-6 sm:px-7 divide-y divide-stone-50">
              {faqPairs.map((pair, idx) => <FAQItem key={idx} question={pair.question} answer={pair.answer} index={idx} />)}
            </div>
          </section>
        );
        i = j; continue;
      }
    }

    // Bullet list
    if (isListItem(block)) {
      const bullets: any[] = [];
      let j = i;
      while (j < blocks.length && isListItem(blocks[j])) { bullets.push(blocks[j]); j++; }
      nodes.push(
        <ul key={`ul-${i}`} className="my-6 space-y-3 ml-1" role="list">
          {bullets.map((b, idx) => (
            <li key={b._key ?? idx} className="flex gap-3 items-start">
              <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" aria-hidden />
              <span className="text-stone-600 text-base leading-relaxed">
                {blockHasLinkPlaceholders(b)
                  ? <>{parseLinkPlaceholders(getBlockText(b))}</>
                  : <RenderChildren children={b.children} markDefs={b.markDefs} />}
              </span>
            </li>
          ))}
        </ul>
      );
      i = j; continue;
    }

    if (style === "h2") {
      nodes.push(
        <h2
          key={block._key ?? i}
          id={slugify(text)}
          className="font-serif text-2xl sm:text-[28px] font-bold text-stone-900 mt-14 mb-5 leading-tight scroll-mt-24"
        >
          {blockHasLinkPlaceholders(block) ? parseLinkPlaceholders(text) : <RenderChildren children={block.children} markDefs={block.markDefs} />}
        </h2>
      );
      i++; continue;
    }

    if (style === "h3") {
      nodes.push(
        <h3
          key={block._key ?? i}
          id={slugify(text)}
          className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-10 mb-4 leading-snug scroll-mt-24"
        >
          {blockHasLinkPlaceholders(block) ? parseLinkPlaceholders(text) : <RenderChildren children={block.children} markDefs={block.markDefs} />}
        </h3>
      );
      i++; continue;
    }

    if (style === "h4") {
      const numMatch = text.match(/^(\d+)\.\s+(.+)/);
      if (numMatch) {
        nodes.push(
          <div key={block._key ?? i} className="flex gap-4 items-start mt-10 mb-4">
            <span className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center justify-center shadow-sm">
              {numMatch[1]}
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug pt-1.5">{numMatch[2]}</h3>
          </div>
        );
      } else {
        nodes.push(
          <h4 key={block._key ?? i} className="font-serif text-lg font-bold text-stone-900 mt-8 mb-3 scroll-mt-24">
            {blockHasLinkPlaceholders(block) ? parseLinkPlaceholders(text) : <RenderChildren children={block.children} markDefs={block.markDefs} />}
          </h4>
        );
      }
      i++; continue;
    }

    if (style === "blockquote") {
      nodes.push(
        <blockquote key={block._key ?? i} className="my-8 pl-5 border-l-4 border-amber-400 bg-amber-50/50 py-4 pr-5 rounded-r-lg">
          <p className="font-serif text-lg italic text-stone-700 leading-relaxed">{text}</p>
        </blockquote>
      );
      i++; continue;
    }

    if (style === "normal" && text.trim()) {
      nodes.push(
        blockHasLinkPlaceholders(block) ? (
          <RenderBlockWithPlaceholders
            key={block._key ?? i}
            block={block}
            Tag="p"
            className="text-stone-600 leading-[1.95] text-base sm:text-[16.5px] mb-6 font-body"
          />
        ) : (
          <p key={block._key ?? i} className="text-stone-600 leading-[1.95] text-base sm:text-[16.5px] mb-6 font-body">
            <RenderChildren children={block.children} markDefs={block.markDefs} />
          </p>
        )
      );
    }

    i++;
  }
  return <>{nodes}</>;
}

// ─── Table of Contents ────────────────────────────────────────────────────────
interface TocHeading {
  text: string;
  level: string;
  id: string;
}

function useTocHeadings(blocks: any[]): TocHeading[] {
  return blocks
    .filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3" || b.style === "h4"))
    .map((b) => ({
      text: getBlockText(b),
      level: b.style,
      id: slugify(getBlockText(b)),
    }))
    .filter((h) => !h.text.toLowerCase().includes("frequently asked"))
    .slice(0, 12);
}

function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function DesktopTOC({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings);
  if (headings.length < 3) return null;
  return (
    <nav aria-label="Table of contents" className="hidden xl:block sticky top-24 w-60 flex-shrink-0 self-start">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-4 flex items-center gap-2">
        <span className="w-3 h-[1px] bg-amber-400 inline-block" />
        In this article
      </p>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`
                block text-[12.5px] leading-snug py-1.5 px-2 rounded-lg transition-all duration-200
                ${h.level === "h3" || h.level === "h4" ? "pl-5" : ""}
                ${activeId === h.id
                  ? "bg-amber-50 text-amber-800 font-semibold border-l-2 border-amber-500 pl-3"
                  : "text-stone-400 hover:text-stone-700 hover:bg-stone-50"
                }
              `}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileTOC({ headings }: { headings: TocHeading[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveHeading(headings);
  if (headings.length < 3) return null;

  const activeHeading = headings.find((h) => h.id === activeId);

  return (
    <div className="xl:hidden sticky mt-3 top-20 z-30 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-3 min-h-[48px]"
        aria-expanded={open}
        aria-controls="mobile-toc"
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-amber-600 flex-shrink-0">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
          <span className="text-[12px] font-semibold tracking-wide text-stone-600 uppercase">
            {activeHeading ? (
              <span className="text-amber-700 font-medium normal-case truncate max-w-[200px] sm:max-w-xs inline-block">
                {activeHeading.text}
              </span>
            ) : "Table of Contents"}
          </span>
        </div>
        <svg
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id="mobile-toc"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-80" : "max-h-0"}`}
      >
        <ul className="overflow-y-auto max-h-72 px-4 sm:px-6 pb-3 space-y-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => { e.preventDefault(); setOpen(false); document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                className={`
                  block py-2 px-3 rounded-lg text-[13px] leading-snug transition-colors min-h-[40px] flex items-center
                  ${h.level === "h3" || h.level === "h4" ? "pl-6" : ""}
                  ${activeId === h.id ? "bg-amber-50 text-amber-800 font-semibold" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"}
                `}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Reading Progress ─────────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(d > 0 ? (window.scrollY / d) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-stone-100" role="progressbar" aria-valuenow={Math.round(progress)}>
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
);
const ShareIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ─── Floating Social Actions (desktop) ────────────────────────────────────────
function FloatingActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col gap-2.5 sticky top-28 items-center pt-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
        target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter"
        className="w-10 h-10 rounded-full border border-stone-200 bg-white text-stone-400 flex items-center justify-center hover:border-stone-400 hover:text-stone-700 hover:scale-110 transition-all shadow-sm"
      >
        <TwitterIcon />
      </a>
      <button
        onClick={copy} aria-label="Copy link"
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${copied ? "bg-green-500 border-green-500 text-white scale-110" : "border-stone-200 bg-white text-stone-400 hover:border-stone-400 hover:text-stone-700 hover:scale-110"}`}
      >
        <LinkIcon />
      </button>
      <div className="w-px h-8 bg-stone-200 mt-1" aria-hidden />
    </div>
  );
}

// ─── Image with zoom effect ────────────────────────────────────────────────────
function HeroImage({ post }: { post: Post }) {
  const [zoomed, setZoomed] = useState(false);
  if (!post.featuredImage) return null;
  const src = urlFor(post.featuredImage).width(1600).height(900).url();

  return (
    <>
      <div
        className="relative w-full overflow-hidden bg-stone-900 cursor-zoom-in"
        style={{ paddingTop: "56px" }}
        onClick={() => setZoomed(true)}
        title="Click to zoom"
      >
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={src} alt={post.title} fill priority sizes="100vw"
            className="object-contain transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" aria-hidden />
        <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          Zoom
        </div>
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setZoomed(false)} aria-label="Close"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div className="relative w-full max-w-5xl max-h-[85vh] aspect-video">
            <Image src={src} alt={post.title} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Related Card ─────────────────────────────────────────────────────────────
function RelatedCard({ post }: { post: RelatedPost }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden bg-stone-100 relative">
        {post.featuredImage ? (
          <Image
            src={urlFor(post.featuredImage).width(600).height(338).url()}
            alt={post.title} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-amber-50"><span className="text-4xl">🕉️</span></div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {post.category && (
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{post.category}</span>
          )}
          {date && <span className="text-[11px] text-stone-400">{date}</span>}
        </div>
        <h3 className="font-serif text-[17px] font-semibold leading-snug text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && <p className="text-[13px] text-stone-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
        <div className="mt-auto pt-3 text-[11px] font-bold tracking-[0.1em] uppercase text-amber-600 flex items-center gap-1">
          Read Article
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
function ArticleJsonLd({ post }: { post: Post }) {
  const imageUrl = post.featuredImage ? urlFor(post.featuredImage).width(1200).height(630).url() : undefined;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    ...(imageUrl && { image: imageUrl }),
    datePublished: post.publishedAt, dateModified: post.publishedAt,
    author: { "@type": post.author ? "Person" : "Organization", name: post.author?.name ?? "Radha Rani Handicrafts" },
    publisher: { "@type": "Organization", name: "Radha Rani Handicrafts", logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/blog/${post.slug.current}` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BlogDetailClient({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const hasContent = post.content && post.content.length > 0;
  const tocHeadings = useTocHeadings(post.content ?? []);
  const hasToc = tocHeadings.length >= 3;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif !important; }
        .font-body  { font-family: 'Lora', serif !important; }
        .font-ui    { font-family: 'DM Sans', sans-serif; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        ::selection { background: #fde68a; color: #78350f; }
      `}</style>

      <ArticleJsonLd post={post} />
      <ReadingProgress />

      <div className="min-h-screen bg-[#f9f7f4] font-ui">

        {/* ── Top Nav ── */}
        <nav
          className={`fixed top-[3px] left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-stone-200/60" : "bg-[#f9f7f4]/90 backdrop-blur"}`}
          aria-label="Article navigation"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-stone-500 hover:text-stone-900 transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Back to blog"
            >
              <ChevronLeft /> <span>Blog</span>
            </Link>

            {/* Progress label (desktop) */}
            {post.readTime && (
              <span className="hidden sm:block text-[11px] text-stone-400 font-medium">
                {post.readTime} min read
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={copyLink} aria-label="Share article"
                className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-stone-500 hover:text-stone-900 transition-colors min-h-[44px] px-2"
              >
                <ShareIcon />
                <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* ── Hero Image ── */}
        <HeroImage post={post} />

        {/* ── Article Header Card ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <header
            className={`max-w-2xl mx-auto ${
              post.featuredImage
                ? "bg-[#f9f7f4] -mt-16 sm:-mt-20 relative z-10 rounded-2xl shadow-2xl px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-11"
                : "pt-24 pb-2"
            }`}
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-2 flex-wrap">
                <li><Link href="/" className="text-[11px] text-stone-400 hover:text-amber-700 transition-colors">Home</Link></li>
                <li aria-hidden className="text-stone-300 text-[11px]">/</li>
                <li><Link href="/blog" className="text-[11px] text-stone-400 hover:text-amber-700 transition-colors">Blog</Link></li>
                {post.category && (
                  <>
                    <li aria-hidden className="text-stone-300 text-[11px]">/</li>
                    <li><span className="text-[11px] text-stone-500">{post.category}</span></li>
                  </>
                )}
              </ol>
            </nav>

            {/* Meta */}
            <div className="flex items-center gap-2 sm:gap-3 mb-5 flex-wrap">
              {post.category && (
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                  {post.category}
                </span>
              )}
              {publishedDate && (
                <time dateTime={post.publishedAt} className="text-[12px] text-stone-400">{publishedDate}</time>
              )}
              {post.readTime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden />
                  <span className="text-[12px] text-stone-400">{post.readTime} min read</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-serif font-bold leading-[1.08] tracking-tight text-stone-950 mb-5"
              style={{ fontSize: "clamp(26px, 4.5vw, 52px)" }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-stone-500 text-base sm:text-[17px] leading-relaxed font-body border-l-2 border-amber-400 pl-4 mt-5">
                {post.excerpt}
              </p>
            )}

            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-stone-100">
                {post.author.image && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={urlFor(post.author.image).width(80).height(80).url()} alt={post.author.name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-[13px] font-semibold text-stone-800">{post.author.name}</p>
                  <p className="text-[11px] text-stone-400">Author</p>
                </div>
              </div>
            )}
          </header>
        </div>

        {/* ── Mobile TOC ── */}
        {hasToc && <MobileTOC headings={tocHeadings} />}

        {/* ── Article Body ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24">
          <div className="flex gap-8 lg:gap-12 xl:gap-16 items-start justify-center">

            {/* Social (desktop only — hidden below lg so it doesn't push article off-center) */}
            <aside className="hidden lg:flex w-10 flex-shrink-0" aria-label="Social sharing">
              <FloatingActions title={post.title} />
            </aside>

            {/* Article */}
            <article
              ref={articleRef}
              className="w-full max-w-[680px] min-w-0 mx-auto lg:mx-0"
              aria-label={post.title}
            >
              {hasContent ? (
                <RenderBlocks blocks={post.content!} />
              ) : (
                <p className="text-stone-400 italic font-serif text-xl mt-10">No content available.</p>
              )}

              {/* Footer share strip */}
              <div className="mt-14 pt-7 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {post.category && (
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 tracking-widest uppercase">Share</span>
                  <button
                    onClick={copyLink} aria-label="Copy link"
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${copied ? "bg-green-500 border-green-500 text-white" : "border-stone-200 bg-white text-stone-400 hover:border-stone-400 hover:scale-105"}`}
                  >
                    <LinkIcon />
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter"
                    className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-400 hover:border-stone-400 hover:scale-105 transition-all"
                  >
                    <TwitterIcon />
                  </a>
                </div>
              </div>
            </article>

            {/* Desktop TOC */}
            {hasToc && <DesktopTOC headings={tocHeadings} />}
          </div>
        </div>

        {/* ── Related Posts ── */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <aside className="border-t border-stone-200 bg-stone-50" aria-label="Related articles">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
              <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 mb-1.5">Continue Reading</p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Related Articles</h2>
                </div>
                <Link href="/blog" className="hidden sm:flex items-center gap-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-stone-500 hover:text-amber-700 transition-colors">
                  All Articles →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {post.relatedPosts.map((r) => <RelatedCard key={r._id} post={r} />)}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase text-amber-700 border border-amber-200 bg-amber-50 px-5 py-2.5 rounded-full hover:bg-amber-100 transition-colors">
                  View All Articles
                </Link>
              </div>
            </div>
          </aside>
        )}

        {/* ── Back to top ── */}
        <div className="border-t border-stone-200 py-8 text-center bg-white">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="inline-flex flex-col items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 hover:text-amber-600 transition-colors min-h-[44px] px-4 justify-center"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
              <path d="m18 15-6-6-6 6" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </>
  );
}