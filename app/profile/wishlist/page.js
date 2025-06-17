import { getCountryFromHeaders } from "../../../services/serverApi";
import WishlistComponent from "./wishlist-component";

// Server-side data fetching
async function getWishlistPageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching wishlist page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getWishlistPageData();
  
  return <WishlistComponent initialData={pageData} />;
}