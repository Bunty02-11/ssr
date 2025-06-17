import { getCountryFromHeaders } from "../../../services/serverApi";
import OrdersComponent from "./orders-component";

// Server-side data fetching
async function getOrdersPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching orders page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getOrdersPageData();
  
  return <OrdersComponent initialData={pageData} />;
}
