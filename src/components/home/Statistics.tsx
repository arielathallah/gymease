import React from 'react';

export const Statistics: React.FC = () => {
  const stats = [
    { label: 'Gym Partner Hubs', value: '6', suffix: ' Hubs in Indonesia' },
    { label: 'Partner Gyms', value: '50+', suffix: ' Premium Gyms' },
    { label: 'Completed Workouts', value: '25,000+', suffix: ' Passes Issued' },
    { label: 'Cleanliness Rating', value: '99.8%', suffix: ' Customer Satisfaction' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight">{s.value}</div>
              <div className="text-sm font-bold text-rose-100">{s.label}</div>
              <div className="text-[11px] text-rose-200/80">{s.suffix}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
