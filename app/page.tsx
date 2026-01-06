import Hero from "@/components/Hero";
import Logos from "@/components/Logos"
import ServicesGrid from "@/components/ServicesGrid";
import Trusted from "@/components/Trusted";
import DataFormatting from "@/components/DataFormatting";
import DataDelivery from "@/components/DataDelivery";
import WhyChoose from "@/components/WhyChoose";

export default function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <ServicesGrid />
      <Trusted />
      <DataFormatting />
      <DataDelivery />
      <WhyChoose />
    </>
  );
}
