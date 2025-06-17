// app/privacy-policy/page.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";

const inter = Inter({ subsets: ['latin'] });

const PrivacyPolicy = () => {
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
                    title="Privacy Policy"
                    breadcrumb="Home > Privacy Policy"
                />

                {/* Privacy Policy Content */}
                <div className="max-w-[1360px] mx-auto px-[40px] py-[60px] space-y-6 mq450:py-[40px] mq450:px-[24px] mq450:gap-[24px]">
                    <section>
                        <p className="mb-4">
                            1.1. This privacy policy ("Privacy Policy") shall form an integral part of the Terms of Use of the Website ("Terms") set out at https://www.tornado.store/terms-and-conditions and shall be read along with the Terms. Any capitalized term not specifically defined herein shall draw its meaning from the meaning ascribed to such term in the Terms.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.2. We are Tornado.Store, a service provided by Tornado Brand registered legally. In this Privacy Policy, references to "you" and "User" mean any person submitting any data to us or our agent or the Website.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.3. If you have any comments or suggestions, we would be pleased to receive them at our email address, info@tornado.store
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.4. Data protection is a matter of trust and your privacy is important to us. We shall therefore only use your name and other information which relates to you in the manner set out in this Privacy Policy. We will only collect information where it is necessary for us to do so and we will only collect information if it is relevant to our dealings with you.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.5. We will only keep your information for as long as we are either required to by law or as is relevant for the purposes for which it was collected.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.6. You can visit the Website and browse without having to provide personal details. During your visit to the Website you remain anonymous and at no time can we identify you unless you have an account on the Website and log on with your user name and password.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.7. The Website shall use the information collected from You in accordance with applicable laws including but not limited to the Information Technology Act, 2000 and the rules made there under and use the data only for the purpose of completing the transaction or for purposes as may be required under the laws.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.8. We may collect various information if you seek to place an order for a product to us on the Website.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.9. We collect, store and process your data for processing your purchase on the Website and any possible later claims, and to provide you with our services. We may collect your title, name, gender, email address, postal address, delivery address (if different), telephone number, mobile number, fax number, payment details, payment card details or bank account details, Internet protocol(IP) address, personal information received from social networking sites through which the You have registered to the Website including name, profile picture, email address or friends list, and any information made public in connection with that social media service and such other personal and non-personal information that may be required to access and operate the Website.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.10. Please be advised that the duration of use of the Website by You may also be logged and stored by the Website.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.11. The information may be collected and/or stored in electronic form, however, we are hereby authorized by You to collect/store such information is physical form as well.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.12. We need this information in order to allow you to go ahead with placing your order for a product. We may use that data to process payment for the product and deliver the product to you. We also use that data to inform you when the product is about to be delivered.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.13. We may share the information collected from You with our affiliates, employees, agents, service provider, sellers, suppliers, banks, payment gateway operators and such other individuals and institutions like judicial, quasi-judicial law enforcement agencies.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.14. We may pass your name and address on to a third party in order to make delivery of the product to you (for example to our courier or supplier).
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.15. We may also use your data in order to manage the Website, collect payment from you, enable you to subsequently use parts of the Website, detect any fraud or Website abuses, send you information relevant to the Website or our products, and in case we have any queries. Payments that you make through the Website will be processed by CC avenue payment gateway.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.16. You hereby represent and warrant to the Website that:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>All information derived from in relation to You are true, correct, current and updated.</li>
                            <li>All information given do not belong to any third party, and if they do belong to a third party, you are authorized by such third party to use, access and disseminate such information.</li>
                        </ul>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.17. You shall indemnify and hold harmless the Website and each of the Website's officers, directors, contracts or agents and any third party relying on the information provided by You in the event You are in breach of this Policy.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.18. Your actual order details may also be stored with us and you may access this information by logging into your account on the Website. Here you can view the details of your orders that have been completed, those which are open and those which are shortly to be dispatched and administer your address details, bank details and any newsletter to which you may have subscribed. You undertake to treat the personal access data confidentially and not make it available to unauthorized third parties. We cannot assume any liability for misuse of passwords unless this misuse is our fault.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.19. We shall not share any of your personal information with third parties without your explicit consent. We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent and we only use your information as described in the Privacy Policy. We view protection of your privacy as a very important community principle. We understand clearly that you and Your information is one of our most important assets. We store and process Your information on computers located in the India that are protected by physical as well as technological security devices. We use third parties to verify and certify our privacy principles. If you object to your information being transferred or used in this way please do not use the Website.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.20. Under no circumstances do we rent, trade or share your personal information that we have collected with any other company for their marketing purposes without your consent. We reserve the right to communicate your personal information to any third party that makes a legally-compliant request for its disclosure.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.21. Notwithstanding anything to the contrary, the Website shall not be held responsible for any loss, damage or misuse of the information provided by You.
                        </p>
                    </section>

                    <section>
                        <p className="mb-4">
                            1.22. We store small text files called Cookies in your device in order to enable various features of our apps. They are used to store user preferences and trends which can be used to improve user experience. Settings can be changed to accept or not accept Cookies in your browser settings. If you do accept a Cookie, you thereby agree to our use of any information collected by us through that Cookie. Any such information collected will only be used for improving the website experience.
                        </p>
                    </section>
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

export default PrivacyPolicy;