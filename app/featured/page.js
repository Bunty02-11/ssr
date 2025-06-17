import Featured from "./featured";
import { getFeaturedProducts, getCountryFromHeaders } from "../../services/serverApi";

// Server-side data fetching
async function getFeaturedPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    // Fetch featured products
    const featuredData = await getFeaturedProducts();

    return {
      featuredData: featuredData || { data: [] },
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching featured page data:', error);
    return {
      featuredData: { data: [] },
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getFeaturedPageData();
  
  return <Featured initialData={pageData} />;
}
