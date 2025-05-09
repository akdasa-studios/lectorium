
import React from 'react';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-sadu-dark-purple mb-6">Terms of Service</h1>
          
          <div className="prose prose-purple max-w-none">
            <p className="text-gray-700 mb-4">Last updated: May 9, 2025</p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Listen to Sadhu. By using our app and services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">2. Using Our Services</h2>
            <p className="text-gray-700 mb-4">
              You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">3. Your Content in Our Services</h2>
            <p className="text-gray-700 mb-4">
              Our Services allow you to upload, submit, store, send, and receive content. You retain ownership of any intellectual property rights that you hold in that content.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">4. Software in Our Services</h2>
            <p className="text-gray-700 mb-4">
              When a Service requires or includes downloadable software, this software may update automatically on your device once a new version or feature is available.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">5. Modifying and Terminating our Services</h2>
            <p className="text-gray-700 mb-4">
              We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">6. Liability for our Services</h2>
            <p className="text-gray-700 mb-4">
              When permitted by law, Listen to Sadhu, and its suppliers and distributors, will not be responsible for lost profits, revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages.
            </p>
            
            <h2 className="text-xl font-semibold text-sadu-dark-purple mt-8 mb-4">7. About these Terms</h2>
            <p className="text-gray-700 mb-4">
              We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
