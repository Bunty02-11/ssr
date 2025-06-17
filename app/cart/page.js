import { getCountryFromHeaders } from "../../services/serverApi";
import Cart from "./cart";

// Server-side data fetching
async function getCartPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching cart page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getCartPageData();
  
  return <Cart initialData={pageData} />;
}
