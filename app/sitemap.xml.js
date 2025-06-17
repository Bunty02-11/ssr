// API configuration
import { apiUrl, frontendUrl } from "../apiUrl";

const BASE_URL = frontendUrl;

export default async function sitemap() {
  try {
         // Fetch data from multiple endpoints concurrently
     const [productsRes, collectionsRes, blogsRes, categoriesRes] = await Promise.all([
       fetch(`${apiUrl}/products/new-arrivals`, { 
         next: { revalidate: 3600 } // Cache for 1 hour
       }),
       fetch(`${apiUrl}/collection`, { 
         next: { revalidate: 3600 }
       }),
       fetch(`${apiUrl}/blogs`, { 
         next: { revalidate: 3600 }
       }),
       fetch(`${apiUrl}/categories/all`, { 
         next: { revalidate: 3600 }
       }),
     ]);

    // Process responses
    const [productsData, collectionsData, blogsData, categoriesData] = await Promise.all([
      productsRes.ok ? productsRes.json() : { data: {} },
      collectionsRes.ok ? collectionsRes.json() : { data: [] },
      blogsRes.ok ? blogsRes.json() : { blogs: [] },
      categoriesRes.ok ? categoriesRes.json() : { data: [] },
    ]);

    // Static pages with priorities
    const staticPages = [
      { path: '', priority: 1.0, changeFreq: 'daily' },
      { path: 'shop', priority: 0.9, changeFreq: 'weekly' },
      { path: 'about-us', priority: 0.8, changeFreq: 'monthly' },
      { path: 'contact-us', priority: 0.7, changeFreq: 'monthly' },
      { path: 'featured', priority: 0.8, changeFreq: 'weekly' },
      { path: 'blog', priority: 0.7, changeFreq: 'weekly' },
      { path: 'faqs', priority: 0.6, changeFreq: 'monthly' },
      { path: 'privacy-policy', priority: 0.5, changeFreq: 'yearly' },
      { path: 'term-of-use', priority: 0.5, changeFreq: 'yearly' },
      { path: 'shipping&delivery', priority: 0.6, changeFreq: 'monthly' },
      { path: 'profile', priority: 0.4, changeFreq: 'monthly' },
      { path: 'cart', priority: 0.3, changeFreq: 'never' },
      { path: 'checkout', priority: 0.3, changeFreq: 'never' },
      { path: 'login', priority: 0.3, changeFreq: 'never' },
      { path: 'register', priority: 0.3, changeFreq: 'never' },
    ];

    const staticSitemapEntries = staticPages.map((page) => ({
      url: `${BASE_URL}/${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    }));

    let dynamicSitemapEntries = [];

    // Extract products from all countries and remove duplicates
    let allProducts = [];
    if (productsData.data) {
      Object.keys(productsData.data).forEach(country => {
        if (Array.isArray(productsData.data[country])) {
          allProducts = [...allProducts, ...productsData.data[country]];
        }
      });
    }
    
    // Remove duplicate products by _id
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p._id === product._id)
    );

    // Product sitemap entries
    const productEntries = uniqueProducts.map((product) => ({
      url: `${BASE_URL}/products-details?productId=${product._id}`,
      lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // Collection sitemap entries
    const collectionEntries = (collectionsData.data || []).map((collection) => ({
      url: `${BASE_URL}/collection?id=${collection._id}`,
      lastModified: new Date(collection.updatedAt || collection.createdAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Blog sitemap entries
    const blogEntries = (blogsData.blogs || blogsData.data || []).map((blog) => ({
      url: `${BASE_URL}/blog-details?id=${blog._id}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // Category/Movement sitemap entries
    const categoryEntries = (categoriesData.data || []).map((category) => ({
      url: `${BASE_URL}/movement?id=${category._id}`,
      lastModified: new Date(category.updatedAt || category.createdAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    dynamicSitemapEntries = [
      ...productEntries,
      ...collectionEntries,
      ...blogEntries,
      ...categoryEntries,
    ];

    return [...staticSitemapEntries, ...dynamicSitemapEntries];

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return basic static pages on error
    const fallbackPages = [
      { path: '', priority: 1.0, changeFreq: 'daily' },
      { path: 'shop', priority: 0.9, changeFreq: 'weekly' },
      { path: 'about-us', priority: 0.8, changeFreq: 'monthly' },
      { path: 'contact-us', priority: 0.7, changeFreq: 'monthly' },
    ];

    return fallbackPages.map((page) => ({
      url: `${BASE_URL}/${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    }));
  }
} 