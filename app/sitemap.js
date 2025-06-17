// API configuration
import { apiUrl, frontendUrl } from "../apiUrl";

export default async function sitemap() {
  try {
    const [productsRes, allProductsRes, productCollectionsRes, productMovementsRes, movementsRes, blogsRes] = await Promise.all([
      fetch(`${apiUrl}/products/new-arrivals`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/products/all`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/products/collection`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/products/movement`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/movement`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/blogs`, { next: { revalidate: 3600 } }),
    ]);

    let [productsData, allProductsData, productCollectionsData, productMovementsData, movementsData, blogsData] = await Promise.all([
      productsRes.ok ? productsRes.json() : { data: {} },
      allProductsRes.ok ? allProductsRes.json() : { data: {} },
      productCollectionsRes.ok ? productCollectionsRes.json() : { data: [] },
      productMovementsRes.ok ? productMovementsRes.json() : { data: [] },
      movementsRes.ok ? movementsRes.json() : { data: [] },
      blogsRes.ok ? blogsRes.json() : { blogs: [] },
    ]);

    // Static pages - FIXED: removed ampersand from shipping&delivery
    const staticPages = [
      { path: '', priority: 1.0, changeFreq: 'daily' },
      { path: 'shop', priority: 0.9, changeFreq: 'weekly' },
      { path: 'about-us', priority: 0.8, changeFreq: 'monthly' },
      { path: 'contact', priority: 0.7, changeFreq: 'monthly' },
      { path: 'featured', priority: 0.8, changeFreq: 'weekly' },
      { path: 'blog', priority: 0.7, changeFreq: 'weekly' },
      { path: 'faqs', priority: 0.6, changeFreq: 'monthly' },
      { path: 'privacy-policy', priority: 0.5, changeFreq: 'yearly' },
      { path: 'term-of-use', priority: 0.5, changeFreq: 'yearly' },
      { path: 'shipping-delivery', priority: 0.6, changeFreq: 'monthly' },
      { path: 'profile', priority: 0.4, changeFreq: 'monthly' },
    ];

    const staticEntries = staticPages.map((page) => ({
      url: `${frontendUrl}/${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    }));

    // Product entries - combine new arrivals and all products
    let productEntries = [];
    let allProducts = [];
    
    // Process new arrivals products
    if (productsData.data) {
      Object.keys(productsData.data).forEach(country => {
        if (Array.isArray(productsData.data[country])) {
          allProducts = [...allProducts, ...productsData.data[country]];
        }
      });
    }
    
    // Process all products
    if (allProductsData.data) {
      Object.keys(allProductsData.data).forEach(country => {
        if (Array.isArray(allProductsData.data[country])) {
          allProducts = [...allProducts, ...allProductsData.data[country]];
        }
      });
    }
    
    // Remove duplicates and create entries
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p._id === product._id)
    );

    productEntries = uniqueProducts.map((product) => ({
      url: `${frontendUrl}/products-details?productId=${product._id}`,
      lastModified: new Date(product.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // Product Collection entries
    const productCollectionEntries = (productCollectionsData.data || []).map((collection) => ({
      url: `${frontendUrl}/collection?id=${collection._id}`,
      lastModified: new Date(collection.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Product Movement entries
    const productMovementEntries = (productMovementsData.data || []).map((movement) => ({
      url: `${frontendUrl}/movement?id=${movement._id}`,
      lastModified: new Date(movement.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Movement entries
    const movementEntries = (movementsData.data || []).map((movement) => ({
      url: `${frontendUrl}/movement?id=${movement._id}`,
      lastModified: new Date(movement.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Blog entries
    const blogEntries = (blogsData.blogs || blogsData.data || []).map((blog) => ({
      url: `${frontendUrl}/blog-details?id=${blog._id}`,
      lastModified: new Date(blog.updatedAt || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticEntries, ...productEntries, ...productCollectionEntries, ...productMovementEntries, ...movementEntries, ...blogEntries];

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    return [
      {
        url: frontendUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${frontendUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];
  }
}