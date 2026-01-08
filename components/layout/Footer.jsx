import Link from "next/link";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { IoCall, IoMail } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-[#2F66F6] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">

        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-[#2F66F6] rounded-full px-2 py-1">
              <img src="images/logos/main-logo/small-logo.png" alt="DataScraperHub Logo" />
            </span>
            DataScraperHub
          </div>

          <p className="mt-4 text-sm text-blue-100 leading-relaxed">
            DataScraperHub is a web scraping service company that extracts any
            relevant website and helps you get data for all your business
            requirements with 100% accuracy.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-6">
            <SocialIcon><FaFacebookF /></SocialIcon>
            <SocialIcon><FaXTwitter /></SocialIcon>
            <SocialIcon><FaInstagram /></SocialIcon>
            <SocialIcon><FaLinkedinIn /></SocialIcon>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-4">Navigations</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li className="hover:text-white cursor-pointer">
              <Link href="/">Home</Link></li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/faq">FAQs</Link>
            </li>
            {/* <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Sites</li> */}
            <li className="hover:text-white cursor-pointer">
              <Link href="/contact">Contact Us</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/gdpr">GDPR Compliance</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/location-report">Location Based Data</Link></li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/b2b">B2B Database</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li className="hover:text-white cursor-pointer">
             <Link href="/service/real-estate-data-scraping">Real Estate Data Scraping</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/service/sales-leads-data">Sales Lead Data</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/service/ecom-scraping">E-Commerce Data Scraping</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/service/recruitment-scraping">Recruitment Data Scraping</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/service/news-monitoring-data-scraping">News Monitoring Data Scraping</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/service/retail-data-scraping">Retail Store Data Scraping</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/service/research-data-scraping">Research & Journalism Data Scraping</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm text-blue-100">
            <p className="flex items-center gap-2">
              <IoCall className="text-white" /> <span>+91 90814 66782</span>
            </p>
            <p className="flex items-center gap-2">
              <IoMail className="text-white" /> <span>info@datascraperhub.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-400/40 py-4 text-center text-sm text-blue-100">
        © DataScraperHub 2014–2024 All Rights Reserved
      </div>
    </footer>
  );
}

/* Reusable Social Icon Wrapper */
function SocialIcon({ children }) {
  return (
    <div className="w-9 h-9 flex items-center justify-center rounded-full border border-white/60 hover:bg-white hover:text-[#2F66F6] transition cursor-pointer">
      {children}
    </div>
  );
}
