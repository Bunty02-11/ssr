import { getCountryFromHeaders } from "../../services/serverApi";
import Profile from "./profile-component";

// Server-side data fetching
async function getProfilePageData() {
  try {
    // Use default country for static generation
    const detectedCountry = getCountryFromHeaders();
    
    return {
      detectedCountry,
    };
  } catch (error) {
    console.error('Error fetching profile page data:', error);
    return {
      detectedCountry: 'uae',
    };
  }
}

export default async function Page() {
  const pageData = await getProfilePageData();
  
  return <Profile initialData={pageData} />;
}
