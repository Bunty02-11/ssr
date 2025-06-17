"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
        Return to Home
      </Link>
    </div>
  );
}