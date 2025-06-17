"use client";

import axiosInstance from './axios';


// User-related API services
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post('/users/address', addressData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, just clear localStorage and return
      localStorage.removeItem('token');
      return true;
    }

    const response = await axiosInstance.get('/users/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    // Even if logout API fails, clear token locally
    localStorage.removeItem('token');
    throw error;
  }
};
