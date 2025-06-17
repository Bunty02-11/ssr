import { Suspense } from "react";
import ProductsDetails from "./products-details";
import { getProductDetails, getCountrySpecificData, getCountryFromHeaders } from "../../services/serverApi";

// Loading component for Suspense fallback
function ProductDetailsLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-lg">Loading Product Details...</div>
    </div>
  );
}

// Server-side data fetching
async function getProductDetailsPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    // For static generation, don't fetch specific product data
    // Product data will be fetched client-side based on URL params
    return {
      productData: { data: [] },
      countryData: null,
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching product details page data:', error);
    return {
      productData: { data: [] },
      countryData: null,
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getProductDetailsPageData();
  
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductsDetails initialData={pageData} />
    </Suspense>
  );
}
