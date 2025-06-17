"use client";

import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import PageBanner from "../../components/page-banner";

const ProfilePageComponent = ({ initialData }) => {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
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
      <PageBanner title="Profile" breadcrumb="Home > Profile" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* <h1 className="text-3xl font-bold text-center mb-12">My Profile</h1> */}

        {/* Profile Header */}
        <div className="bg-[#fff] border-solid border-[1px] border-black rounded-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border-solid border-[1px] border-black rounded-full flex items-center justify-center text-2xl uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-xl text-black font-semibold">{user?.name}</h2>
              <p className="text-black">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-2">
          <button
            className="w-full text-left px-6 py-4 bg-[#fff] border-solid text-black hover:text-white border-[1px] border-black rounded-lg hover:bg-black hover:text-white hover:border-white transition-colors"
            onClick={() => router.push('/profile/addresses')}
          >
            <div className="flex items-center  justify-between">
              <span>Addresses</span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </button>

          <button
            className="w-full text-left px-6 py-4 bg-[#fff] border-solid text-black hover:text-white border-[1px] border-black rounded-lg hover:bg-black hover:text-white hover:border-white transition-colors"
            onClick={() => router.push('/profile/orders')}
          >
            <div className="flex items-center  justify-between">
              <span>Order History</span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </button>

          <button
            className="w-full text-left px-6 py-4 bg-[#fff] border-solid text-black hover:text-white border-[1px] border-black rounded-lg hover:bg-black hover:text-white hover:border-white transition-colors"
            onClick={() => router.push('/profile/wishlist')}
          >
            <div className="flex items-center justify-between">
              <span>Wishlist</span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </button>
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

export default ProfilePageComponent; 