import Home from "./home";
import { getHomeData, getProductsData, getCountrySpecificData, getCountryFromHeaders } from "../services/serverApi";

// Server-side data fetching
async function getPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    // Fetch data in parallel
    const [homeData, productsData] = await Promise.all([
      getHomeData(),
      getProductsData()
    ]);

    // Extract country-specific data
    const countrySpecificHome = homeData ? getCountrySpecificData(homeData, detectedCountry) : null;
    const countrySpecificProducts = productsData ? getCountrySpecificData(productsData, detectedCountry) : [];

    return {
      homeData: homeData || { data: [] },
      productsData: productsData || { data: [] },
      countryData: countrySpecificHome,
      countryProducts: countrySpecificProducts,
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      homeData: { data: [] },
      productsData: { data: [] },
      countryData: null,
      countryProducts: [],
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getPageData();
  
  return <Home initialData={pageData} />;
}
