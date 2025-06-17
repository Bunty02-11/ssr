import { getCountryFromHeaders } from "../../services/serverApi";
import Privacy from "./privacy";

// Server-side data fetching
async function getPrivacyPolicyPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching privacy policy page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getPrivacyPolicyPageData();
  
  return <Privacy initialData={pageData} />;
}
