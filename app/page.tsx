import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col p-5">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}