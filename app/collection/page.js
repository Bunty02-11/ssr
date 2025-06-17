import { Suspense } from "react";
import Collection from "./collection";
import { getCollectionData, getCountryFromHeaders } from "../../services/serverApi";

// Loading component for Suspense fallback
function CollectionLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-lg">Loading Collection...</div>
    </div>
  );
}

// Server-side data fetching
async function getCollectionPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    // For static generation, don't fetch specific collection data
    // Collection data will be fetched client-side based on URL params
    return {
      collectionData: { data: [] },
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching collection page data:', error);
    return {
      collectionData: { data: [] },
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getCollectionPageData();
  
  return (
    <Suspense fallback={<CollectionLoading />}>
      <Collection initialData={pageData} />
    </Suspense>
  );
}
