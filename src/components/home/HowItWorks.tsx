import React from 'react';
import { Search, Calendar, Shirt, QrCode } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Find Your Preferred Gym',
      desc: 'Browse partner gyms across Kemanggisan, Grogol, BSD, Bekasi, Tangerang, and Depok.',
    },
    {
      num: '02',
      icon: Calendar,
      title: 'Pick Schedule & Pass',
      desc: 'Select your preferred workout date, arrival time slot, and single or monthly pass package.',
    },
    {
      num: '03',
      icon: Shirt,
      title: 'Add Rental Clothes & Towel',
      desc: 'Choose your size (XS to XXL) for dry-fit apparel set and fresh towel rental during checkout.',
    },
    {
      num: '04',
      icon: QrCode,
      title: 'Scan QR Ticket at Gym',
      desc: 'Show your instant QR Ticket at reception, pick up your sealed workout kit, and train hard!',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-950/80 border border-rose-800 px-3 py-1 rounded-full">
            Seamless 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
            How GymEase Works
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            No bulky gym bags, no laundry hassle. Just show up and workout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} className="bg-slate-800/80 border-slate-700/80 text-white relative">
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-700">{step.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
