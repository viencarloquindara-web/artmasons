"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };

    // initial check
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      aria-label="Back to top"
      onClick={handleClick}
      className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[10000] bg-[#800000] text-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-[#80000099]"
      title="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
