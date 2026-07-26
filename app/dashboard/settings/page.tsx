'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * /dashboard/settings redirects to /dashboard with the profile tab.
 * Profile settings are embedded directly in the dashboard page.
 */
export default function SettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Profile settings live inside /dashboard under the "profile" tab
    router.replace('/dashboard#profile');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
