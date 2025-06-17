import { Suspense } from 'react';
import Movement from './movement';
import { getCountryFromHeaders } from "../../services/serverApi";

// Server-side data fetching for movement page
async function getMovementPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching movement page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
    const pageData = await getMovementPageData();
    
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
            <Movement initialData={pageData} />
        </Suspense>
    );
}
