import { getCountryFromHeaders } from "../../services/serverApi";
import Shop from "./shop";

// Server-side data fetching
async function getShopPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching shop page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getShopPageData();
  
  return <Shop initialData={pageData} />;
}
