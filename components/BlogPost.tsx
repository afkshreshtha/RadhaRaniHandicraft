"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity.cli";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  featuredImage?: any;
  publishedAt?: string;
  category?: string;
  readTime?: number;
}
export async function getBlogCategories() {
  return await client.fetch(`
    *[_type == "blogCategorySchema"] | order(title asc) {
      _id,
      title
    }
  `);
}

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
];

function formatDate(dateStr?: string, long = false) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);
const GridIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <rect x="0" y="0" width="7" height="7" rx="1" />
    <rect x="9" y="0" width="7" height="7" rx="1" />
    <rect x="0" y="9" width="7" height="7" rx="1" />
    <rect x="9" y="9" width="7" height="7" rx="1" />
  </svg>
);
const ListIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ── Card Meta ─────────────────────────────────────────────────────────────────
function CardMeta({ post, compact = false }: { post: Post; compact?: boolean }) {
  const date = formatDate(post.publishedAt, !compact);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {post.category && (
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-700">
          {post.category}
        </span>
      )}
      {post.category && date && <span className="w-1 h-1 rounded-full bg-stone-300" />}
      {date && (
        <span className={`text-stone-400 ${compact ? "text-[11px]" : "text-xs"}`}>
          {date}
        </span>
      )}
      {post.readTime && (
        <>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className={`text-stone-400 ml-auto ${compact ? "text-[11px]" : "text-xs"}`}>
            {post.readTime} min read
          </span>
        </>
      )}
    </div>
  );
}

// ── Image Block ────────────────────────────────────────────────────────────────
function PostImage({ post, width, className = "" }: { post: Post; width: number; className?: string }) {
  return (
    <div className={`overflow-hidden bg-stone-100 ${className}`}>
      {post.featuredImage ? (
        <img
          src={urlFor(post.featuredImage).width(width).url()}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-serif text-5xl italic text-stone-200">✦</span>
        </div>
      )}
    </div>
  );
}

// ── Featured Card ─────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group col-span-full grid md:grid-cols-2 border border-stone-200 overflow-hidden hover:bg-amber-50/40 transition-colors duration-200"
    >
      <PostImage post={post} width={900} className="aspect-video md:aspect-auto md:min-h-[380px]" />
      <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
        <div>
          <span className="inline-flex text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-700 border border-amber-200 bg-amber-50 px-3 py-1 rounded-full">
            Featured
          </span>
        </div>
        <CardMeta post={post} />
        <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight tracking-tight text-stone-900">
          {post.title}
        </h2>
        <p className="text-sm leading-relaxed text-stone-500 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-stone-800">
            Read Article
          </span>
          <span className="text-stone-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowIcon size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Grid Card ─────────────────────────────────────────────────────────────────
function GridCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group border border-stone-200 overflow-hidden hover:bg-amber-50/30 transition-colors duration-200 flex flex-col h-full"
    >
      <PostImage post={post} width={600} className="aspect-[4/3]" />
      <div className="flex flex-col flex-1 p-6 gap-3">
        <CardMeta post={post} compact />
        <h2 className="font-serif text-xl font-normal leading-snug tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
          {post.title}
        </h2>
        <p className="text-[13px] leading-relaxed text-stone-500 line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-stone-700">
            Read Article
          </span>
          <span className="text-stone-300 transition-all duration-200 group-hover:text-stone-600 group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── List Card ─────────────────────────────────────────────────────────────────
function ListCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group grid grid-cols-[140px_1fr] sm:grid-cols-[200px_1fr] border-b border-stone-200 hover:bg-amber-50/30 transition-colors duration-200 overflow-hidden"
    >
      <PostImage post={post} width={400} className="aspect-[3/2]" />
      <div className="flex flex-col justify-center gap-2 p-5 sm:p-6">
        <CardMeta post={post} />
        <h2 className="font-serif text-xl sm:text-2xl font-normal leading-snug text-stone-900 group-hover:text-amber-900 transition-colors">
          {post.title}
        </h2>
        <p className="hidden sm:block text-[13px] leading-relaxed text-stone-500 line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogPage({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchCategories() {
      const data = await getBlogCategories();
      setCategories(["All", ...data.map((cat: any) => cat.title)]);
    }
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (activeCategory !== "All")
      result = result.filter((p) => p.category === activeCategory);
    if (search.trim())
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(search.toLowerCase())
      );
    result.sort((a, b) => {
      if (sort === "newest")
        return new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime();
      if (sort === "oldest")
        return new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime();
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      return 0;
    });
    return result;
  }, [posts, search, activeCategory, sort]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', serif !important; }
      `}</style>

      {/* ── Hero ── */}
      <header className="relative bg-stone-100 border-b border-stone-200 px-6 md:px-10 pt-16 pb-12 overflow-hidden">
        {/* watermark — changed to BLOG */}
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 font-serif font-light leading-none tracking-widest select-none pointer-events-none text-transparent"
          style={{
            fontSize: "clamp(60px, 12vw, 140px)",
            WebkitTextStroke: "1px #d4cfc8",
          }}
        >
          BLOG
        </span>
        {/* label — changed to "Blog" */}
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 mb-4">
          Blog
        </p>
        {/* headline — updated to reflect spiritual handicrafts content */}
        <h1
          className="font-serif font-light leading-none tracking-tight max-w-lg"
          style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
        >
          Spiritual <span className="italic text-amber-800">Insights</span>
          <br />& Sacred Stories
        </h1>
      </header>

      {/* ── Category Pills ── */}
      <div className="flex gap-2 flex-wrap px-6 md:px-10 py-5 border-b border-stone-200 bg-stone-50">
        {categories?.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase border transition-all duration-150 ${
              activeCategory === cat
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-200 text-stone-500 hover:border-stone-700 hover:text-stone-800 bg-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Controls Bar ── */}
      <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 px-6 md:px-10 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border border-stone-200 rounded focus:outline-none focus:border-amber-400 placeholder:text-stone-400 text-stone-800 transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-[13px] border border-stone-200 rounded bg-transparent text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>

        {/* Layout toggles */}
        <div className="hidden sm:flex gap-1 ml-auto">
          <button
            onClick={() => setLayout("grid")}
            aria-label="Grid view"
            className={`w-9 h-9 flex items-center justify-center border rounded transition-all duration-150 ${
              layout === "grid"
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-200 text-stone-400 hover:border-stone-500 bg-transparent"
            }`}
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setLayout("list")}
            aria-label="List view"
            className={`w-9 h-9 flex items-center justify-center border rounded transition-all duration-150 ${
              layout === "list"
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-200 text-stone-400 hover:border-stone-500 bg-transparent"
            }`}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="px-6 md:px-10 pt-5 pb-1 text-[11px] tracking-[0.1em] uppercase text-stone-400">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {/* ── Posts ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-3 text-center px-6">
          <span className="font-serif text-6xl font-light text-stone-200">✦</span>
          <h3 className="font-serif text-3xl font-light text-stone-400">No articles found</h3>
          <p className="text-sm text-stone-400">Try adjusting your filters or search query.</p>
        </div>
      ) : layout === "grid" ? (
        <div className="px-6 md:px-10 py-6 pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200">
          {featured && (
            <div className="bg-stone-50 col-span-full">
              <FeaturedCard post={featured} />
            </div>
          )}
          {rest.map((post) => (
            <div key={post._id} className="bg-stone-50">
              <GridCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 md:px-10 py-6 pb-20 border-t border-stone-200">
          {filtered.map((post) => (
            <ListCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}