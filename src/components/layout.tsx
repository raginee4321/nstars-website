import React from 'react';
import { Star } from 'lucide-react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import backgroundImg from './img.jpg';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: 'home' | 'gallery' | 'login' | 'admin' | 'qrscanner') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen text-white flex flex-col relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      </div>

      {/* Subtle corner stars */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Star className="absolute top-24 left-5 w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '7s' }} />
        <Star className="absolute top-24 right-5 w-5 h-5 text-red-400 animate-pulse" />
        <Star className="absolute top-1/2 left-5 w-4 h-4 text-blue-300 animate-bounce" />
        <Star className="absolute top-1/2 right-5 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation onNavigate={onNavigate} />
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
