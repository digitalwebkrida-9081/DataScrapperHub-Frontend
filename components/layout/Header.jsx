"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar(){
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="logo" width="50" /> <span className="font-bold text-xl">DataScraperHub </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-m text-#040D21">
          <Link href="/service" className="hover:underline">Services</Link>
          <Link href="/b2b" className="hover:underline">B2B Database</Link>
          <Link href="/location-report" className="hover:underline">Location Reports</Link>
          <a href="#blog" className="hover:underline">Blog</a>
          <Link href="/contact" className="hover:underline">Contact-Us</Link>
          
        </nav>

        <div className="flex items-center gap-4">
          <a className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm" href="/contact">Lets Talk !</a>

          {/* mobile menu */}
          <button className="lg:hidden p-2" onClick={()=>setOpen(!open)} aria-label="menu">
            <span className="block w-6 h-0.5 bg-slate-700 mb-1"/>
            <span className="block w-6 h-0.5 bg-slate-700 mb-1"/>
            <span className="block w-6 h-0.5 bg-slate-700"/>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t">
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link href="/service">Services</Link>
            <Link href="/b2b">B2B Database</Link>
            <Link href="/location-report">Location Reports</Link>
            <Link href="/contact">Contact-Us</Link>
          </div>
        </div>
      )}
    </header>
  );
}
