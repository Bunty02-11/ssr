import { getCountryFromHeaders } from "../../services/serverApi";
import Term from "./term";

// Server-side data fetching
async function getTermsPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching terms page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getTermsPageData();
  
  return <Term initialData={pageData} />;
}
