import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Image, LogIn } from 'lucide-react';

type ViewType = 'home' | 'gallery' | 'login' | 'admin' | 'qrscanner';

interface NavigationProps {
  onNavigate: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { icon: JSX.Element; label: string; view: ViewType }[] = [
    { icon: <Home size={18} />, label: 'Home', view: 'home' },
    { icon: <Image size={18} />, label: 'Gallery', view: 'gallery' },
    { icon: <LogIn size={18} />, label: 'Admin', view: 'login' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black bg-opacity-95 backdrop-blur-lg shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Empty left side - logo only shown in hero section */}
          <div></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-all duration-300 group relative py-2 px-4 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-yellow-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 transition-all duration-300 ${
                  isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                }`}
              />
              <X
                className={`absolute inset-0 transition-all duration-300 ${
                  isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg mt-2 border border-gray-700">
            {navItems.map((item, index) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-6 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
