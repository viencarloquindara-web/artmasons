"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";

const THEME_RED = "#800000";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const NAV_ITEMS = [
    { label: "Artists A-Z", href: "/artists-a-z" },
    { label: "Top 100 Paintings", href: "/top-100" },
    { label: "Our Quality", href: "/our-quality" },
    { label: "Frame & Size Art", href: "/frame-size-art" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <header className="relative z-50 bg-white pt-6 pb-4 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-end gap-12">
        <div
          className="flex-shrink-0 flex flex-col items-center justify-end w-auto md:w-56 cursor-pointer pb-2"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative w-32 h-32 md:w-44 md:h-44">
            <Image
              src="/artmasons_logo.png"
              alt="Art Masons Seal"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full justify-end">
          <div className="flex flex-col md:flex-row items-center gap-6 relative w-full">
            <div className="flex-1 w-full relative z-20">
              <div
                className={`flex items-center border rounded-sm overflow-hidden bg-white w-full`}
                style={{ borderColor: THEME_RED }}
              >
                <input
                  type="text"
                  placeholder="Search For Paintings"
                  className="w-full px-4 py-3 outline-none text-base placeholder-gray-400 font-serif"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-3 hover:bg-gray-100 transition-colors">
                  <Search size={22} className="text-black" />
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-6 self-center h-full pb-1">
              <div
                className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden shadow-sm border border-gray-200"
                title="UAE"
              >
                <div className="absolute inset-y-0 left-0 w-1/4 bg-red-600"></div>
                <div className="absolute top-0 right-0 w-3/4 h-1/3 bg-green-600"></div>
                <div className="absolute bottom-0 right-0 w-3/4 h-1/3 bg-black"></div>
                <div className="absolute top-1/3 right-0 w-3/4 h-1/3 bg-white"></div>
              </div>

              <Link href="/cart" className="flex items-center gap-2 cursor-pointer hover:opacity-70">
                <div className="relative">
                  <ShoppingBag size={28} color="black" strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 bg-[#800000] text-white text-sm w-4 h-4 rounded-full flex items-center justify-center font-serif">
                    0
                  </span>
                </div>
              </Link>

              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          <div className="h-10 hidden md:block"></div>

          <div className={`w-full ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
            <nav>
              <ul className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 py-2 font-serif text-base md:text-lg tracking-wide uppercase w-full">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className="cursor-pointer text-black hover:text-[#800000] transition-colors relative group whitespace-nowrap"
                  >
                    <Link href={item.href}>{item.label}</Link>
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#800000] transition-all duration-300 group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
