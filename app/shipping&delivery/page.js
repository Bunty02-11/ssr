import { getCountryFromHeaders } from "../../services/serverApi";
import ShippingAndDelivery from "./shippinganddelivery";

// Server-side data fetching
async function getShippingPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching shipping page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getShippingPageData();
  
  return <ShippingAndDelivery initialData={pageData} />;
}
