import axiosInstance from './axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api';

// Google OAuth integration
export const initiateGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

// Apple OAuth integration (using Sign in with Apple JS)
export const initiateAppleLogin = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.AppleID) {
      reject(new Error('Apple ID SDK not loaded'));
      return;
    }

    window.AppleID.auth.signIn().then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
};



// Handle Apple login response
export const handleAppleLogin = async (appleAuthData) => {
  try {
    const response = await axiosInstance.post('/auth/apple', {
      id_token: appleAuthData.authorization.id_token,
      user_info: appleAuthData.user || null
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Parse OAuth callback URL params
export const parseOAuthCallback = (url) => {
  const urlParams = new URLSearchParams(url.split('?')[1]);
  return {
    token: urlParams.get('token'),
    provider: urlParams.get('provider'),
    error: urlParams.get('error')
  };
}; 