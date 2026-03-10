import type { Metadata } from "next";
import Privacy from "@/components/privacy-policy/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | DataSellerHub",
  description: "Read the DataSellerHub privacy policy to understand how we collect, use, and protect personal information. Learn about our commitment to secure data handling and privacy compliance.",
};

export default function Gdprpage() {
  return <Privacy />;
}
