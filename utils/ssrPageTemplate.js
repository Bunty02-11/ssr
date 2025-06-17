// Template for converting pages to SSR
// This is a helper utility to guide conversion of remaining pages

export const createSSRPageTemplate = (
  componentName,
  componentPath,
  dataFetcher = null,
  extractCountryData = true
) => {
  return `import ${componentName} from "${componentPath}";
import { getCountryFromHeaders } from "../../services/serverApi";
import { headers } from 'next/headers';
${dataFetcher ? `import { ${dataFetcher} } from "../../services/serverApi";` : ''}

// Server-side data fetching
async function get${componentName}PageData(${dataFetcher && dataFetcher.includes('Details') ? 'params' : 'searchParams'}) {
  try {
    // Get country from headers or default to UAE
    const headersList = headers();
    const detectedCountry = getCountryFromHeaders(headersList);
    
    ${dataFetcher ? `
    // Fetch page-specific data
    const pageData = await ${dataFetcher}(${dataFetcher.includes('Details') ? 'params.id' : ''});
    
    ${extractCountryData ? `
    // Extract country-specific data if needed
    const countrySpecificData = pageData ? getCountrySpecificData(pageData, detectedCountry) : null;
    ` : ''}
    
    return {
      pageData: pageData || { data: [] },
      ${extractCountryData ? 'countryData: countrySpecificData,' : ''}
      detectedCountry,
    };` : `
    return {
      detectedCountry,
    };`}
  } catch (error) {
    console.error('Error fetching ${componentName.toLowerCase()} page data:', error);
    return {
      ${dataFetcher ? 'pageData: { data: [] },' : ''}
      ${extractCountryData ? 'countryData: null,' : ''}
      detectedCountry: 'uae',
    };
  }
}

export default async function Page(${dataFetcher && dataFetcher.includes('Details') ? '{ params }' : '{ searchParams }'}) {
  const pageData = await get${componentName}PageData(${dataFetcher && dataFetcher.includes('Details') ? 'params' : 'searchParams'});
  
  return <${componentName} initialData={pageData} />;
}`;
};

// List of pages that need conversion with their specific data fetchers
export const pagesToConvert = [
  {
    path: 'app/contact/page.js',
    componentName: 'Contact',
    componentPath: './contact',
    dataFetcher: null,
    extractCountryData: false
  },
  {
    path: 'app/movement/page.js',
    componentName: 'Movement',
    componentPath: './movement',
    dataFetcher: null,
    extractCountryData: false
  },
  {
    path: 'app/products-details/page.js',
    componentName: 'ProductsDetails',
    componentPath: './products-details',
    dataFetcher: 'getProductDetails',
    extractCountryData: true
  },
  {
    path: 'app/blog-details/page.js',
    componentName: 'BlogDetails',
    componentPath: './blog-details',
    dataFetcher: 'getBlogDetails',
    extractCountryData: false
  },
  {
    path: 'app/privacy-policy/page.js',
    componentName: 'Privacy',
    componentPath: './privacy',
    dataFetcher: null,
    extractCountryData: false
  },
  {
    path: 'app/term-of-use/page.js',
    componentName: 'Term',
    componentPath: './term',
    dataFetcher: null,
    extractCountryData: false
  },
  {
    path: 'app/shipping&delivery/page.js',
    componentName: 'ShippingAndDelivery',
    componentPath: './shippinganddelivery',
    dataFetcher: null,
    extractCountryData: false
  }
];

// Helper function to update component to accept initialData prop
export const updateComponentForSSR = (componentCode, hasDataFetching = true) => {
  if (!hasDataFetching) {
    // For components without data fetching, just add initialData prop
    return componentCode.replace(
      /const (\w+) = \(\) => {/,
      'const $1 = ({ initialData }) => {'
    );
  }
  
  // For components with data fetching, update state initialization and useEffect
  return componentCode
    .replace(
      /const (\w+) = \(\) => {/,
      'const $1 = ({ initialData }) => {'
    )
    .replace(
      /const \[(\w+), set\w+\] = useState\(([^)]+)\);/g,
      'const [$1, set$1] = useState(initialData?.$1 || $2);'
    )
    .replace(
      /const \[loading, setLoading\] = useState\(true\);/,
      'const [loading, setLoading] = useState(!initialData);'
    );
}; 