import { getCountryFromHeaders } from "../../services/serverApi";
import OrderSuccess from "./order-success";

// Server-side data fetching
async function getOrderSuccessPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching order success page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getOrderSuccessPageData();
  
  return <OrderSuccess initialData={pageData} />;
}
