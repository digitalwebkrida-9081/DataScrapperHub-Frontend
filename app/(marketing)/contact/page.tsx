import type { Metadata } from "next";
import Contact from "@/components/contact/Contact";

export const metadata: Metadata = {
  title: "Contact | DataSellerHub",
  description: "Contact DataSellerHub for web scraping, B2B database, and data extraction services. Speak with our experts to get accurate business data and customized data solutions.",
};

export default function ContactPage() {
  return <Contact />;
}