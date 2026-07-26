import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedGyms } from '@/components/home/FeaturedGyms';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyChooseGymEase } from '@/components/home/WhyChooseGymEase';
import { Statistics } from '@/components/home/Statistics';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { FAQSection } from '@/components/home/FAQSection';
import { PromoBannerSection } from '@/components/home/PromoBannerSection';
import { LiveChat } from '@/components/common/LiveChat';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <HeroBanner />
        <FeaturedGyms />
        <PromoBannerSection />
        <HowItWorks />
        <WhyChooseGymEase />
        <Statistics />
        <CustomerReviews />
        <FAQSection />
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}
