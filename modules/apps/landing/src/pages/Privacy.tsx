
import React from 'react';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-sadu-dark-purple mb-6">Privacy Policy</h1>
          
          <div className="prose prose-purple max-w-none">
            <p className="text-gray-700 mb-4">Last updated: May 9, 2025</p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Listen to Sadhu ("we" or "us" or "our") respects the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We may collect information about you in various ways, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Personal Data: name, email address, and other contact information you voluntarily provide.</li>
              <li>Usage Data: information about how you access and use our application.</li>
              <li>Device Data: information about your mobile device including device type, operating system, and unique device identifiers.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We may use the information we collect about you for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our services</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">4. Disclosure of Your Information</h2>
            <p className="text-gray-700 mb-4">
              We may share information we have collected about you in certain situations, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>With service providers who perform services for us</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">5. Your Choices</h2>
            <p className="text-gray-700 mb-4">
              You can choose not to provide certain information, but this may limit your ability to use certain features of our application. You can also opt-out of certain communications.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">6. Security</h2>
            <p className="text-gray-700 mb-4">
              We use appropriate technical and organizational measures to protect your personal information, but no method of transmission over the Internet is 100% secure.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@listentosadhu.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
