"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Build path
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const name = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { name, href };
  });

  return (
    <nav className="text-sm text-gray-500 mb-4 flex gap-2 items-center">
      <Link href="/" className="hover:underline">
        Home
      </Link>

      {breadcrumbs.map((crumb, i) => (
        <span key={i} className="flex gap-2 items-center">
          ›
          {i === breadcrumbs.length - 1 ? (
            <span className="text-gray-800 font-medium">{crumb.name}</span>
          ) : (
            <Link href={crumb.href} className="hover:underline">
              {crumb.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
