import {
  Navbar,
  HeroSection,
  FeatureCategories,
  HowItWorksSection,
  TransformBanner,
  TestimonialsSection,
  CtaSection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Feature Categories 5-Card Showcase */}
        <FeatureCategories />

        {/* 3. How It Works (Smartphone App Mockup + 3 Steps) */}
        <HowItWorksSection />

        {/* 4. Transform Dark Banner ("More Than Editing It's a New You") */}
        <TransformBanner />

        {/* 5. Testimonials ("Loved by Creators...") */}
        <TestimonialsSection />

        {/* 6. Ready to Transform Your Photos? (Bottom CTA) */}
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
