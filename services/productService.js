"use client";
import axios from './axios';

/**
 * Search for products based on query
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of product results
 */
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`/products/search?q=${encodeURIComponent(query)}`);
    console.log('Search API response:', response);
    
    // Check if response.data exists and has the expected format
    if (response.data) {
      // If response.data is an array, return it directly
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If response.data has a products property that is an array, return that
      if (response.data.products && Array.isArray(response.data.products)) {
        return response.data.products;
      }
      
      // If response.data has a data property that is an array, return that
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // If response.data is an object but not in expected format, convert to array
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.log('Converting object response to array');
        return Object.values(response.data);
      }
    }
    
    console.warn('Unexpected API response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

/**
 * Fetch top products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise<Array>} - Array of top products
 */
export const getTopProducts = async (limit = 5) => {
  try {
    const response = await axios.get(`/products/top?limit=${limit}`);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

/**
 * Fetch all collections
 * @returns {Promise<Array>} - Array of collections
 */
export const getAllCollections = async () => {
  try {
    const response = await axios.get('/categories/all');
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

/**
 * Fetch top collections
 * @param {number} limit - Number of collections to fetch
 * @returns {Promise<Array>} - Array of top collections
 */
export const getTopCollections = async (limit = 5) => {
  try {
    // First get all collections
    const collections = await getAllCollections();
    
    // Return the top N collections (or all if fewer than limit)
    return collections.slice(0, limit);
  } catch (error) {
    console.error('Error fetching top collections:', error);
    return [];
  }
};
