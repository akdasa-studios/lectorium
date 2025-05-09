
import { Button } from '@/components/ui/button';
import { BookOpen, Apple, PlaySquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="pattern-bg min-h-screen flex flex-col items-center justify-center relative pt-16 section-padding">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sadu-purple/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-sadu-gold/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col space-y-6">
          {!isMobile && (
            <div className="flex items-center opacity-0 animate-fade-in">
              <BookOpen className="h-8 w-8 text-sadu-purple mr-2" />
              <span className="text-lg font-medium text-sadu-deep-purple">Ancient Wisdom for Modern Life</span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight opacity-0 animate-fade-in animate-delay-100">
            Discover the <span className="heading-gradient">Vedic Knowledge</span> in Your Pocket
          </h1>
          
          <p className="text-lg text-gray-700 max-w-xl opacity-0 animate-fade-in animate-delay-200">
            Explore ancient Sanskrit teachings, guided meditations, and timeless wisdom adapted for your modern life journey, all within a beautiful mobile experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 opacity-0 animate-fade-in animate-delay-300">
            <Button size="lg" className="bg-black hover:bg-black/80 text-white flex items-center">
              <Apple className="mr-2 h-5 w-5" />
              App Store
            </Button>
            <Button size="lg" className="bg-black hover:bg-black/80 text-white flex items-center">
              <PlaySquare className="mr-2 h-5 w-5" />
              Google Play
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 pt-6 opacity-0 animate-fade-in animate-delay-400">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-sadu-purple/80 to-sadu-purple/30 border border-white" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">1,000+</span> 5-star reviews
            </p>
          </div>
        </div>
        
        <div className="relative flex items-center justify-center opacity-0 animate-fade-in animate-delay-200">
          <div className="absolute inset-0 bg-gradient-radial from-sadu-purple/20 to-transparent rounded-full blur-2xl -z-10" />
          <div className="w-full max-w-xs mx-auto">
            <div className="relative aspect-[9/19] rounded-[2.5rem] border-8 border-sadu-dark-purple p-1 bg-sadu-off-white shadow-2xl animate-float">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
                <iframe 
                  src="https://mobile.listentosadhu.app/" 
                  className="w-full h-full border-0" 
                  title="App Preview"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-20 opacity-0 animate-fade-in animate-delay-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "1000+", label: "Lectures" },
            { number: "10+", label: "Lectors" },
            { number: "20+", label: "Vedic Categories" },
            { number: "Daily", label: "Wisdom Updates" }
          ].map((stat, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-3xl font-serif font-bold text-sadu-purple">{stat.number}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
