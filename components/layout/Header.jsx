"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBlenderPhone, FaPhone, FaPhoneAlt, FaPhoneVolume } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";

export default function Navbar(){
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="logo" width="50" /> <span className="font-bold text-xl">DataSellerHub </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-m font-medium text-[#040D21]">
          <Link href="/service" className="hover:underline">Services</Link>
          <Link href="/b2b" className="hover:underline">B2B Database</Link>
          <Link href="/location-report" className="hover:underline">Location Reports</Link>
          <a href="#blog" className="hover:underline">Blog</a>
          <Link href="/contact" className="hover:underline">Contact-Us</Link>
          
        </nav>

        <div className="flex items-center gap-4">
          
          {/* Contact Component */}
          <div className="hidden lg:flex items-center bg-[#F8F9FD] rounded-md overflow-hidden border border-slate-100 p-1">
             <div className="flex items-center gap-3 px-3 py-1">
                 <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500">
                     <FaPhoneAlt size={14} />
                 </div>
                 <div className="flex flex-col">
                  <a href="tel:+919081466782">
                     <span className="text-[13px] text-slate-500 font-medium">Any Question</span> <br />
                     <span className="text-sm font-bold text-slate-800">+91 90814 66782</span>
                  </a>
                 </div>
             </div>
             <button className="bg-[#1e1e1e] hover:bg-black text-white p-3 rounded-md transition ml-2">
                 <a href="tel:+919081466782"><IoGrid size={18} /></a>
             </button>
          </div>
          
          {/* Mobile Connect Button (Keep standard button for mobile only or hide if component should show?) 
              Lets hide the complex component on mobile and show a simple button, or just the menu toggle. 
              The user removed 'Lets Talk', so likely wants this replacements. 
              I'll keep the menu toggle for sure.
          */}

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
