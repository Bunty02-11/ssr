import { getCountryFromHeaders } from "../../../services/serverApi";
import AddressesComponent from "./addresses-component";

// Server-side data fetching
async function getAddressesPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching addresses page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getAddressesPageData();
  
  return <AddressesComponent initialData={pageData} />;
}
