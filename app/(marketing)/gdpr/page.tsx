import type { Metadata } from "next";
import Gdpr from "@/components/gdpr/Gdpr";

export const metadata: Metadata = {
  title: "GDPR Compliance & Data Privacy Policy | DataSellerHub",
  description: "Learn how DataSellerHub complies with GDPR regulations and protects user data. Our policies ensure transparency, secure data processing, and respect for privacy rights.",
};

export default function Gdprpage() {
  return <Gdpr />;
}
