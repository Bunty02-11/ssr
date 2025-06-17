import { getCountryFromHeaders } from "../../services/serverApi";
import Contact from "./contact";

// Server-side data fetching
async function getContactPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getContactPageData();
  
  return <Contact initialData={pageData} />;
}
