"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import PageBanner from "../../../components/page-banner";

const OrdersPageComponent = ({ initialData }) => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user orders here
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Add your orders fetching logic here
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // setOrders(data);
        setOrders([]); // Placeholder
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar
        logoSrc="/logo.webp"
        search="/search.svg"
        account="/account.svg"
        sVG="/svg2.svg"
        navbarBackgroundColor={"transparent"}
      />
      <PageBanner title="Order History" breadcrumb="Home > Profile > Orders" />

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
          <h1 className="text-2xl font-bold text-black mb-6">Order History</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-black mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Link 
                href="/shop"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={order.id || index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-black">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-black mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3">
                            <img 
                              src={item.image || '/no-image.webp'} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-black">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-black mb-2">Order Total</h4>
                      <p className="text-lg font-bold text-black">{order.total}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Track Order
                    </button>
                    {order.status?.toLowerCase() === 'delivered' && (
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Reorder
                      </button>
                    )}
                  </div>
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

export default OrdersPageComponent; 