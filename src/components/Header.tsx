import React from 'react';
import { Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative py-16 md:py-24">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-red-500 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-10 animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* ✅ Logo section */}
        <div className="flex items-center justify-center mb-8 relative">
          <img 
            src="/logo1.png"   // logo1.png must be inside public/ folder
            alt="N Stars Taekwondo Academy Logo" 
            className="w-28 h-28 object-cover rounded-full border-4 border-yellow-400 shadow-lg mx-auto"
          />
          {/* Decorative star on top of logo */}
          <Star 
            className="absolute -top-4 -right-4 w-8 h-8 text-red-500 animate-spin" 
            style={{ animationDuration: '4s' }}
          />
        </div>

        {/* Full title with same styling */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-gradient-x leading-tight"
          style={{ fontFamily: 'Garamond, serif' }}
        >
          N STARS TAEKWONDO ACADEMY
        </h1>

        {/* Decorative underline */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto animate-pulse mb-8"></div>

        {/* Quote */}
        <p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90"
          style={{ fontFamily: 'Garamond, serif' }}
        >
          SPORTS * FITNESS * SELF DEFENCE * DISCIPLINE
        </p>

        {/* Floating small glowing dots + stars */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"></div>
          <div
            className="absolute top-32 right-32 w-1 h-1 bg-red-400 rounded-full animate-twinkle"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-blue-400 rounded-full animate-twinkle"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute bottom-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"
            style={{ animationDelay: '0.5s' }}
          ></div>

          {/* ✅ Extra stars in background */}
          <Star className="absolute top-10 right-1/3 w-6 h-6 text-yellow-300 animate-spin" />
          <Star className="absolute bottom-10 left-1/4 w-5 h-5 text-red-400 animate-pulse" />
          <Star className="absolute top-1/3 right-10 w-7 h-7 text-blue-300 animate-bounce" />
        </div>
      </div>
    </header>
  );
};

export default Header;
