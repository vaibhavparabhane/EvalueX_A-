"use client";

import { Navbar } from '@/components/marketing/Navbar';
import { HeroSection } from '@/components/marketing/HeroSection';
import { Features } from '@/components/marketing/Features';
import { Workflow } from '@/components/marketing/Workflow';
import { WhyEvalueX } from '@/components/marketing/WhyEvalueX';
import { DashboardPreview } from '@/components/marketing/DashboardPreview';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col relative overflow-hidden transition-all duration-300">
      <Navbar />
      
      <main className="marketing-main flex-1 w-full relative z-10">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Core Features Section */}
        <Features />

        {/* 3. Simple Workflow Section */}
        <Workflow />

        {/* 4. Platform Benefits Section */}
        <WhyEvalueX />

        {/* 5. Dashboard Preview Section */}
        <DashboardPreview />

        {/* 6. CTA Section */}
        <CTASection />
      </main>

      {/* 7. Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
