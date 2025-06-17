// app/terms-of-service/page.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";

const inter = Inter({ subsets: ['latin'] });

const TermsOfService = () => {
    return (
        <div className={`flex flex-col min-h-screen ${inter.className}`}>
            {/* Navbar */}
            <Navbar
                logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
                search="/search1.svg"
                account="/account1.svg"
                sVG="/svg1.svg"
                navbarBackgroundColor={"transparent"}
            />

            {/* Main Content */}
            <main className="flex-grow">
                {/* Page Banner */}
                <PageBanner
                    title="Terms of Service"
                    breadcrumb="Home > Terms of Service"
                />

                {/* Terms Content */}
                <div className="max-w-[1360px] mx-auto px-[40px] py-[60px] space-y-6 mq450:py-[40px] mq450:px-[24px] mq450:gap-[24px]">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Contractual Partner</h2>
                        <p>
                            Your contractual partner for all orders generated at this online offer is Tornado Brand, Business Bay, Dubai, UAE, hereinafter called "TIME HOUSE TRADING LLC". All deliveries of the Tornado.Store are done by Time House Trading LLC to the customer based on these general terms and conditions.
                        </p>
                    </section>

                    {/* Point-wise Terms Sections */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">Terms of Use</h2>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">1. Introduction</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>1.1</strong> By accessing or using www.tornado.store website or mobile application ("Website"), you agree to be bound by these Terms and Conditions and any additional terms of third party sellers.</li>
                                <li><strong>1.2</strong> By accepting these Terms, you also agree to be bound by Tornado Policies including Privacy Policy.</li>
                                <li><strong>1.3</strong> "User" refers to end user/customer; "Website", "we", "us" refers to tornado.store, its affiliates and partners.</li>
                                <li><strong>1.4</strong> These Terms form an electronic record under Information Technology Act, 2000 and are a valid binding agreement.</li>
                                <li><strong>1.10</strong> We reserve the right to change these Terms at any time. Continued use after changes constitutes acceptance.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">2. Eligibility</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>2.1</strong> Use of Website available only to persons who can legally contract.</li>
                                <li><strong>2.2</strong> Minors must transact through legal guardian/parents.</li>
                                <li><strong>2.3</strong> Website reserves right to terminate membership if user is under 18 years.</li>
                                <li><strong>2.4</strong> By using Website, you declare you are 18+ years and capable of entering binding contract.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">3. Account, Password, and Security</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>3.1</strong> Guest users may not have access to all sections/benefits reserved for registered users.</li>
                                <li><strong>3.2</strong> You are responsible for maintaining password/account confidentiality and all activities.</li>
                                <li><strong>3.4</strong> Website may suspend/terminate accounts with untrue/false/incomplete information.</li>
                                <li><strong>3.6</strong> Users permit Website to collect/retain personal information per Privacy Policy.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">4. Listing And Selling</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>4.1</strong> We warrant all listed Products are legally permitted for sale and provide accurate descriptions.</li>
                                <li><strong>4.2</strong> All sales are binding. Seller must ship within 3 days unless exceptional circumstances.</li>
                                <li><strong>4.3</strong> tornado.store is only facilitator - actual contract is between User and Seller.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">5. Products</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>5.1</strong> Products exhibited "as is" - actual product may vary from images.</li>
                                <li><strong>5.3</strong> No guarantees of exactness of final Product appearance. Quality is sole liability of Seller.</li>
                                <li><strong>5.4</strong> Prices subject to change without notice, even for wishlisted items.</li>
                                <li><strong>5.5</strong> Pre-buzz EORS prices may change during EORS sale.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">6. Payments</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>6.1</strong> Prices incorporated into Terms by reference, may change per Seller terms.</li>
                                <li><strong>6.3</strong> We use third-party payment gateways for collection/remittance.</li>
                                <li><strong>6.4</strong> Not liable for: unauthorized transactions, exceeding preset limits, payment issues, payment method illegitimacy.</li>
                                <li><strong>6.6</strong> Users must provide accurate payment info and not use unlawfully owned instruments.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">9. Cancellation</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>9.1</strong> We may cancel orders due to: fraudulent activity, pricing inaccuracies, stock unavailability.</li>
                                <li><strong>9.2</strong> User considered fraudulent if: doesn't reply to verification, fails document verification, misuses account, uses invalid info, overuses vouchers, returns wrong product, refuses payment, etc.</li>
                                <li><strong>9.4</strong> May cancel 'Bulk Orders' defined as: commercial resale, multiple same product to same address, bulk quantities, invalid address, order placement malpractice.</li>
                                <li><strong>9.5</strong> For partial item claims: must claim within 48 hours, provide description and photos, may need to retain packaging for investigation.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">10. User Conduct and Rules</h3>
                            <p className="font-medium">Users must not:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Defame, abuse, harass, stalk or violate legal rights</li>
                                <li>Post inappropriate, unlawful content</li>
                                <li>Upload protected material without rights</li>
                                <li>Upload viruses/malicious software</li>
                                <li>Conduct unauthorized surveys/contests</li>
                                <li>Falsify/delete author attributions</li>
                                <li>Violate any code of conduct</li>
                                <li>Make derogatory statements about Website</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">11. Intellectual Property Rights</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>11.1</strong> All IPR on Website belong to Website or third party sellers.</li>
                                <li><strong>11.2</strong> Users must not infringe any IPR during use.</li>
                                <li><strong>11.5</strong> Users grant us perpetual, royalty-free license to use their content.</li>
                                <li><strong>11.6</strong> No copying/republishing content without authorization.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">12. Indemnity</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>12.1</strong> User indemnifies Website against losses from: breach of Terms, third party claims, IPR infringement, rights violations.</li>
                                <li><strong>12.4</strong> Website not liable for special/indirect/consequential damages.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">17. Dispute Resolution</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>13.1</strong> Parties shall attempt amicable settlement (15 days minimum).</li>
                                <li><strong>13.2</strong> Unresolved disputes referred to sole arbitrator appointed by Website.</li>
                                <li><strong>13.3</strong> Contact: info@tornado.store or contact us page.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">18. User Protection Program</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>14.1</strong> Provides resolution for disputes regarding refunds/replacements/non-delivery.</li>
                                <li><strong>14.2</strong> Contact info@tornado.store if issue with Seller remains unresolved.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">General Provisions</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Notice:</strong> All notices via email or website notification.</li>
                                <li><strong>Assignment:</strong> User cannot assign rights; Website can.</li>
                                <li><strong>Severability:</strong> If provision void, remainder remains effective.</li>
                                <li><strong>Waiver:</strong> No waiver unless in writing.</li>
                                <li><strong>Force Majeure:</strong> Not liable for events beyond reasonable control.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Contact Information</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Email: info@tornado.store</li>
                                <li>Address: TIME HOUSE TRADING LLC, Business Bay, Dubai, UAE</li>
                                <li>Grievance Officer: info@timehouse.store</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
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

export default TermsOfService;