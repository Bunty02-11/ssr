// export const apiUrl = "http://localhost:5000";
export const apiUrl =
  "https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api";

//export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Frontend base URL
export const frontendUrl = "https://tornado-livid.vercel.app"; // Replace with your actual domain

// API endpoints
export const endpoints = {
  products: {
    newArrivals: `${apiUrl}/products/new-arrivals`,
    all: `${apiUrl}/products/all`,
    byId: (id) => `${apiUrl}/products/${id}`,
  },
  collections: {
    all: `${apiUrl}/collection`,
    byId: (id) => `${apiUrl}/collection/${id}`,
  },
  categories: {
    all: `${apiUrl}/categories/all`,
    byId: (id) => `${apiUrl}/categories/${id}`,
  },
  blogs: {
    all: `${apiUrl}/blogs`,
    byId: (id) => `${apiUrl}/blogs/${id}`,
  },
  home: `${apiUrl}/home`,
};
