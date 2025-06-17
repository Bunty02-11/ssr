import Faqs from "./faqs";
import { getFaqData, getCountrySpecificData, getCountryFromHeaders } from "../../services/serverApi";

// Server-side data fetching
async function getFaqsPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    // Fetch FAQ data
    const faqData = await getFaqData();

    // Extract country-specific data
    const countrySpecificData = faqData ? getCountrySpecificData(faqData, detectedCountry) : null;

    return {
      faqData: faqData || { data: [] },
      countryData: countrySpecificData,
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching faqs page data:', error);
    return {
      faqData: { data: [] },
      countryData: null,
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getFaqsPageData();
  
  return <Faqs initialData={pageData} />;
}
