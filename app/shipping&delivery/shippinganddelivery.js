// app/delivery-policy/page.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";

const inter = Inter({ subsets: ['latin'] });

const DeliveryPolicy = () => {
    return (
        <div className={`flex flex-col min-h-screen ${inter.className}`}>
            {/* Navbar at the top */}
            <Navbar
                logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
                search="/search1.svg"
                account="/account1.svg"
                sVG="/svg1.svg"
                navbarBackgroundColor={"transparent"}
            />

            {/* Main content */}
            <main className="flex-grow">
                {/* Page Banner */}
                <PageBanner
                    title="Shipping & Delivery Policy"
                    breadcrumb="Home > Shipping & Delivery Policy"
                />

                {/* Delivery Policy Content */}
                <div className="max-w-[1360px] mx-auto px-[40px] py-[60px] space-y-6 mq450:py-[40px] mq450:px-[24px] mq450:gap-[24px]">
                    <section>
                        <p className="mb-4">
                            1. All Products purchased from the Website shall be delivered to the User by standard courier services by www.tornado.store on behalf of the respective Sellers through a logistics partner or by the Sellers themselves. All deliveries where applicable shall be made on a best efforts basis, and while the Website will endeavor to deliver the Products on the dates intimated, the Website disclaims any claims or liabilities arising from any delay in this regard. On behalf of the Seller, a nominal fee may be charged on all cash on delivery ("COD") orders. The COD charge can be viewed at the time of placing the order and in all order related emails. This charge shall not be refunded if an item is returned or if the cancellation request is raised after the order is shipped.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            2. www.tornado.store shall not be responsible for any delay in the delivery of the Products. www.tornado.store shall not be liable for any damage to the Product in transit due to mishandling by the logistics partner.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            3. The logistics partner supported by www.tornado.store will make a maximum of three attempts to deliver your order. In case the User is not reachable or does not accept delivery of products in these attempts the respective Seller reserves the right to cancel the order(s) at its discretion.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            4. An estimated delivery time shall be displayed on the order summary page. On placing your order, you will receive an email containing a summary of the order and also the estimated delivery time to your location.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            5. Sometimes, delivery may take longer due to:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Bad weather</li>
                            <li>Flight delays</li>
                            <li>Political disruptions</li>
                            <li>Other unforeseen circumstances</li>
                        </ul>
                    </section>

                    <section>
                        <p className="mb-4">
                            6. In the event any delay in delivery of a Product is expected, the Website may, at its sole discretion, intimate the User who may have purchased the same, regarding such delay.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            7. The Website shall not be held responsible and will bear no liability in case of failure or delay of delivering the Products including any damage or loss caused to the Products.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            8. Where there is a likelihood of delay in delivery of the Products, the User may be notified of the same from time to time. However, no refunds may be claimed by the User for any delay in delivery of the Products, which was caused due to reasons beyond the control of the Website and/or the Seller.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            9. However in case where a damage has been caused to the Products ordered, the Seller shall replace the products as per the Seller's replacement policy as may be indicated on the Website along with the Product.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            10. In case a User purchases multiple Products in one transaction, the Seller(s) may deliver the same together. However, this may not always be possible and shall be subject to availability of stock with the relevant Sellers.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            11. If a User wishes to get delivery to different addresses, then the User shall be required to purchase the Products under separate transactions and provide separate delivery addresses for each transaction, as may be required. The User agrees that the delivery can be made to the person who is present at the shipping address provided by the User.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            12. www.tornado.store shall not compensate for any mental agony caused due to delay in delivery. The Users can cancel the order at any moment of time even if the delivery time exceeds the expected delivery time. If it is a prepaid order, the Users will be refunded back the price of the product in the account or payment wallet, in accordance with the options chosen by you, as soon as the order is successfully cancelled.
                        </p>
                    </section>

                    {/* <section className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Connect Us Here:</h2>
                        <address className="not-italic">
                            <p className="font-bold">Time House Trading L.L.C.</p>
                            <p>807, ETA Star's Al Manara Tower,</p>
                            <p>Business Bay, Dubai, UAE</p>
                            <p>P.O Box: 99190</p>
                        </address>
                    </section> */}
                </div>
            </main>

            {/* Footer at the bottom */}
            <Footer
                footerAlignSelf="stretch"
                footerWidth="unset"
                maskGroup="/mask-group@2x.webp"
                iconYoutube="/icon--youtube2.svg"
                itemImg="/item--img3.svg"
                itemImg1="/item--img-13.svg"
                itemImg2="/item--img-23.svg"
            />
        </div>
    );
};

export default DeliveryPolicy;