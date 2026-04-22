import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Image, LogIn, Star, Phone } from 'lucide-react';

type ViewType = 'home' | 'gallery' | 'login' | 'admin' | 'qrscanner' | 'features' | 'contact' | 'about';

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

  const navigateOrScroll = (view: ViewType) => {
    if (view === 'features') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (view === 'contact') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (view === 'about') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      onNavigate(view);
    }
  };

  const navItems: { icon: JSX.Element; label: string; view: ViewType }[] = [
    { icon: <Home size={18} />, label: 'Home', view: 'home' },
    { icon: <Image size={18} />, label: 'Gallery', view: 'gallery' },
    { icon: <Star size={18} />, label: 'Features', view: 'features' },
    { icon: <Users size={18} />, label: 'About', view: 'about' },
    { icon: <Phone size={18} />, label: 'Contact', view: 'contact' },
    { icon: <LogIn size={18} />, label: 'Admin', view: 'login' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black bg-opacity-95 backdrop-blur-lg shadow-2xl`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Academy Name - Left Side */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo1.png"
              alt="N Stars Logo"
              className="w-10 h-10 object-cover rounded-full"
            />
            <span
              className="font-bold text-base md:text-lg leading-tight"
              style={{ fontFamily: 'Garamond, serif' }}
            >
              <span style={{ color: '#111111', WebkitTextStroke: '0.5px rgba(255,255,255,0.9)' }}>N</span>
              {' '}
              <span style={{ color: '#ef4444' }}>S</span>
              <span style={{ color: '#3b82f6' }}>T</span>
              <span style={{ color: '#22c55e' }}>A</span>
              <span style={{ color: '#facc15' }}>R</span>
              <span style={{ color: '#ffffff' }}>S</span>
              {' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400">
                Taekwondo Academy
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  navigateOrScroll(item.view);
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
                  navigateOrScroll(item.view);
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
