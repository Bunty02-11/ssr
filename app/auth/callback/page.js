"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../../../context/CartContext';

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useUser();
  const { checkAuthAndFetchCart } = useCart();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed. Please try again.');
        router.push('/login');
        return;
      }

      if (token) {
        try {
          // Store the token
          localStorage.setItem('token', token);
          
          // Fetch user profile with the new token
          const response = await fetch('https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            updateUser(userData.data);
            await checkAuthAndFetchCart();
            
            toast.success(`Successfully signed in with ${provider === 'google' ? 'Google' : 'Apple'}!`);
            
            // Handle pending cart item and redirects (same as regular login)
            const pendingCartItem = localStorage.getItem("pendingCartItem");
            const redirectUrl = localStorage.getItem("redirectAfterLogin");

            if (pendingCartItem) {
              const product = JSON.parse(pendingCartItem);
              const { productId, quantity = 1, name } = product;
              
              const selectedCountry = localStorage.getItem('selectedCountry') || 'uae';
              
              await fetch('https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/cart', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  productId,
                  quantity,
                  currency: selectedCountry
                })
              });
              
              toast.success(`Added ${name} to cart`);
              await checkAuthAndFetchCart();
              localStorage.removeItem("pendingCartItem");
            }

            // Handle guest wishlist migration
            let guestWishlist = [];
            try {
              guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
            } catch { guestWishlist = []; }
            
            if (guestWishlist.length > 0) {
              const migrationPromises = guestWishlist.map(item =>
                fetch(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/wishlist/${item._id || item.productId}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }).catch(() => null)
              );

              const results = await Promise.allSettled(migrationPromises);
              const successfulMigrations = results.filter(
                result => result.status === "fulfilled" && result.value?.ok
              ).length;

              if (successfulMigrations > 0) {
                toast.success(`Migrated ${successfulMigrations} item(s) from guest wishlist`);
              }

              localStorage.removeItem("guestWishlist");
            }

            // Redirect to intended page or home
            if (redirectUrl) {
              localStorage.removeItem("redirectAfterLogin");
              router.push(redirectUrl);
            } else {
              router.push("/");
            }
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        toast.error('No authentication token received.');
        router.push('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, updateUser, checkAuthAndFetchCart]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-black text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
      <p className="text-black text-lg">Loading...</p>
    </div>
  </div>
);

// Wrapped component with Suspense boundary
const AuthCallbackPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallback />
    </Suspense>
  );
};

export default AuthCallbackPage; 