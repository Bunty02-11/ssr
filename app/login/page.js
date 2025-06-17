import { getCountryFromHeaders } from "../../services/serverApi";
import Login from "./login";

// Server-side data fetching
async function getLoginPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching login page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getLoginPageData();
  
  return <Login initialData={pageData} />;
}
