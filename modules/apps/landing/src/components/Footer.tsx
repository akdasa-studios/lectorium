import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-sadu-dark-purple text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              
              <span className="text-xl font-serif font-semibold">Listen to Sadhu</span>
            </div>
            <p className="text-gray-300 mb-6">
              Ancient wisdom reimagined for your modern journey.
            </p>
            <div className="flex space-x-4">
              {["M9 0a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm4.5 5.67a.5.5 0 01.5.5v2.66a.5.5 0 01-.5.5h-2.67a.5.5 0 01-.5-.5v-.16a.5.5 0 01.5-.5h2v-2a.5.5 0 01.5-.5h.17zm-9.16.84a.5.5 0 01.5-.5h2.33a2.17 2.17 0 010 4.33H5.5v1.5a.5.5 0 01-.5.5h-.16a.5.5 0 01-.5-.5V6.5zm2.17 2.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v2h1.5z", "M9 0a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm1.34 12.33a.5.5 0 01-.5.5h-.17a.5.5 0 01-.5-.5v-.16a2.5 2.5 0 01-2-2.34.5.5 0 01.5-.5h.16a.5.5 0 01.5.5 1.5 1.5 0 001.34 1.5v-3.67a2.17 2.17 0 01-1.16-3.83c.33-.25.75-.42 1.16-.42v-.24a.5.5 0 01.5-.5h.17a.5.5 0 01.5.5v.24a2.5 2.5 0 012 2.34.5.5 0 01-.5.5h-.16a.5.5 0 01-.5-.5 1.5 1.5 0 00-1.34-1.5v3.67a2.17 2.17 0 011.16 3.83c-.33.25-.75-.42 1.16-.42v.16z", "M9 0a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm-1.83 4a3.83 3.83 0 00-3.84 3.83c0 1.63 1.02 3.06 2.5 3.58v-1.02a2.84 2.84 0 01-1.5-2.56c0-1.56 1.28-2.84 2.84-2.84.77 0 1.47.3 1.98.8L8 6.83l1.17-1.17c.51-.5 1.21-.8 1.98-.8 1.56 0 2.84 1.28 2.84 2.84 0 1.56-1.28 2.84-2.84 2.84-.77 0-1.47-.3-1.98-.8L8 9.17l-.83.83a.5.5 0 10.7.7l1-1a.5.5 0 00.01-.72c.36-.31.83-.48 1.3-.48 1 0 1.83.84 1.83 1.84 0 1-.83 1.84-1.83 1.84-.48 0-.94-.17-1.3-.48a.5.5 0 00-.7 0l-1 1c-.2.2-.2.5 0 .7a.5.5 0 00.7 0c.52.5 1.22.8 1.99.8A2.83 2.83 0 0011.83 12a3.83 3.83 0 01-6.67-2.56c0-.8.24-1.54.66-2.15a.5.5 0 00-.64-.76A3.82 3.82 0 003.33 10a3.83 3.83 0 006.66 2.58 3.83 3.83 0 006.68-2.58A3.83 3.83 0 0011.17 6c-.77 0-1.47.3-1.98.8L8 7.83 6.83 6.66A3.83 3.83 0 004 4z"].map((path, i) => <a key={i} href="#" className="p-2 rounded-full bg-sadu-purple/20 hover:bg-sadu-purple/30 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor">
                    <path d={path} />
                  </svg>
                </a>)}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">App</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="https://www.linkedin.com/company/akd-studios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} AKd Studios</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;