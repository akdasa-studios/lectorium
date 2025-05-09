
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return <header className={cn("fixed top-0 w-full z-50 transition-all duration-300", isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-sadu-purple">
                <AvatarImage src="/lovable-uploads/acb0a4a1-c49c-4f3d-8dc2-3aee32773e48.png" alt="Sadu Logo" />
                <AvatarFallback className="bg-sadu-purple text-white">SD</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-2xl font-serif font-semibold text-sadu-dark-purple">Listen to Sadhu</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sadu-dark-purple hover:text-sadu-purple transition-colors">
              Features
            </a>
            <a href="#about" className="text-sadu-dark-purple hover:text-sadu-purple transition-colors">
              About
            </a>
            <a href="#download" className="text-sadu-dark-purple hover:text-sadu-purple transition-colors">
              Download
            </a>
          </nav>
        </div>
      </div>
    </header>;
};

export default NavBar;
