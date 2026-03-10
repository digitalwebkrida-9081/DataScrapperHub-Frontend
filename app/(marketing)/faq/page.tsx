import type { Metadata } from "next";
import FaqSection from "@/components/faq/FaqSection";

export const metadata: Metadata = {
  title: "FAQs | DataSellerHub",
  description: "Find answers to common questions about web scraping, data extraction, B2B databases, pricing, data formats, and delivery. Learn how DataSellerHub helps businesses access structured data.",
};

export default function FaqPage() {
  return <FaqSection />;
}
