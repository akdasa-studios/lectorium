
import { Button } from '@/components/ui/button';
import { BookOpen, Apple, PlaySquare, Facebook, MessageSquare } from 'lucide-react';

const DownloadSection = () => {
  return (
    <section id="download" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pattern-bg opacity-10 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-sadu-purple to-sadu-deep-purple rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-white/90 mr-2" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Begin Your Wisdom Journey</h2>
            </div>
            
            <p className="text-lg text-white/80 mb-8">
              Download the Listen to Sadhu app today and access centuries of Vedic wisdom reimagined for your modern life journey.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button size="lg" className="bg-white text-sadu-deep-purple hover:bg-white/90 font-medium flex items-center justify-center">
                <Apple className="h-5 w-5 mr-2" />
                App Store
              </Button>
              
              <Button size="lg" className="bg-white text-sadu-deep-purple hover:bg-white/90 font-medium flex items-center justify-center">
                <PlaySquare className="h-5 w-5 mr-2" />
                Google Play
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-white/20">
              {[
                { number: "4.9", label: "App Store Rating" },
                { number: "4.8", label: "Google Play Rating" },
                { number: "10K+", label: "Active Users" },
                { number: "Free", label: "With Premium Options" }
              ].map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <p className="text-3xl font-serif font-bold text-white">{stat.number}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 heading-gradient">
            Follow Us
          </h3>
          
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Join our community on social media to stay updated with the latest wisdom, events, and connect with fellow seekers.
          </p>
          
          <div className="flex justify-center gap-6">
            <a 
              href="https://vk.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-sadu-purple/10 hover:bg-sadu-purple/20 transition-colors text-sadu-deep-purple"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-vk">
                <path d="M14 22V11a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v11"></path>
                <path d="M19 22V8a1 1 0 0 0-1-1h-3v4"></path>
                <path d="M5 22V8a1 1 0 0 1 1-1h3v4"></path>
                <path d="M10 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6"></path>
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-sadu-purple/10 hover:bg-sadu-purple/20 transition-colors text-sadu-deep-purple"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a 
              href="https://telegram.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-sadu-purple/10 hover:bg-sadu-purple/20 transition-colors text-sadu-deep-purple"
            >
              <MessageSquare className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
