import { getCountryFromHeaders } from "../../services/serverApi";
import Checkout from "./checkout";

// Server-side data fetching
async function getCheckoutPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching checkout page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getCheckoutPageData();
  
  return <Checkout initialData={pageData} />;
}
