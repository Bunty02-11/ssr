import BlogDetails from "./blog-details";
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <BlogDetails />;
    </Suspense>
  );
}
