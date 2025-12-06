"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Add a slight delay to override Next.js scroll restoration
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' to avoid animation, or 'smooth' for smooth scroll
      });
      console.log("Scrolled to top");
    }, 0);
  }, [pathname]);

  return null;
}
