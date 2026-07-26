import React from 'react';
import { Briefcase, Sparkles, MapPin, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';

export const WhyChooseGymEase: React.FC = () => {
  const benefits = [
    {
      icon: Briefcase,
      title: 'Zero Bag Hassle',
      desc: 'Gym straight from office, meeting, or travel without carrying wet towels or gym clothes in your briefcase.',
    },
    {
      icon: Sparkles,
      title: '90°C Sanitized Gear',
      desc: 'All rental apparel and towels undergo medical-grade thermal washing and sealed pouch packaging.',
    },
    {
      icon: MapPin,
      title: 'Nationwide Network',
      desc: 'One account grants pass access across Jakarta Barat, BSD, Bekasi, Tangerang, and Depok branches.',
    },
    {
      icon: Zap,
      title: 'Instant QR Check-in',
      desc: 'Skip queue lines at reception desk. Scan your QR Booking pass directly from your phone.',
    },
    {
      icon: RefreshCw,
      title: 'XS to XXL Size Guarantee',
      desc: 'Full size range available in stock with live inventory status check during online checkout.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Pricing',
      desc: 'No hidden membership commitments. Pay per visit or choose flexible multi-branch passes.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full">
            Why Choose GymEase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            The Ultimate Hands-Free Gym Experience
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Reinventing how active urbanites workout across Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <Card key={idx} className="hover:-translate-y-1 transition-transform">
                <CardBody className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{b.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
