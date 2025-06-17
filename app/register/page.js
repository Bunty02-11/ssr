import { getCountryFromHeaders } from "../../services/serverApi";
import Register from "./register";

// Server-side data fetching
async function getRegisterPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching register page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getRegisterPageData();
  
  return <Register initialData={pageData} />;
}
