"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import PageBanner from "../../../components/page-banner";

const AddressesPageComponent = ({ initialData }) => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user addresses here
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        // Add your address fetching logic here
        // const response = await fetch('/api/addresses');
        // const data = await response.json();
        // setAddresses(data);
        setAddresses([]); // Placeholder
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    } else if (!loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar
        logoSrc="/logo.webp"
        search="/search.svg"
        account="/account.svg"
        sVG="/svg2.svg"
        navbarBackgroundColor={"transparent"}
      />
      <PageBanner title="My Addresses" breadcrumb="Home > Profile > Addresses" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Back to Profile */}
        <div className="mb-8">
          <Link 
            href="/profile"
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Profile
          </Link>
        </div>

        <div className="bg-white border border-black rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">My Addresses</h1>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-black mb-2">No addresses found</h3>
              <p className="text-gray-600">You haven't added any addresses yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-black">{address.type}</span>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {address.street}<br />
                    {address.city}, {address.state} {address.zipCode}<br />
                    {address.country}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer
        maskGroup="/logo.webp"
        iconYoutube="/icon--youtube.svg"
        itemImg="/icon--facebook.svg"
        itemImg1="/icon--instagram.svg"
        itemImg2="/icon--linkedin.svg"
      />
    </div>
  );
};

export default AddressesPageComponent; 