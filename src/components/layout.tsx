import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import backgroundImg from './img.jpg'; // Make sure this exists in your src folder

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
