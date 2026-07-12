'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * LayoutWrapper handles structural responsive layout offsets.
 * Shifts content to the right (pl-64) on desktop to make room for the left sidebar,
 * and shifts down (pt-16) on mobile for the top bar navigation.
 * Hides offsets completely on the login page.
 */
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a]">
      {/* Sidebar / Mobile Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full min-h-screen flex flex-col justify-between transition-all duration-300 ${
          isLoginPage 
            ? 'pl-0 pt-0' 
            : 'pl-0 pt-16 md:pt-0 md:pl-64'
        }`}
      >
        <div className="flex-grow w-full">
          {children}
        </div>
        {!isLoginPage && <Footer />}
      </main>
    </div>
  );
}
