import { getBlogData, getCountryFromHeaders } from "../../services/serverApi";
import Blog from "./blog";

// Server-side data fetching
async function getBlogPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    // Fetch blog data
    const blogData = await getBlogData();

    return {
      blogData: blogData || { data: [] },
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching blog page data:', error);
    return {
      blogData: { data: [] },
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getBlogPageData();
  
  return <Blog initialData={pageData} />;
}
