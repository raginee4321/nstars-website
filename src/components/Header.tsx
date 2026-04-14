import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative py-16 md:py-24">
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">

        {/* Logo section */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logo1.png"
            alt="N Stars Taekwondo Academy Logo"
            className="w-28 h-28 object-cover rounded-full shadow-lg mx-auto"
          />
        </div>

        {/* Full title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'Garamond, serif' }}
        >
          {/* N STARS - individually colored */}
          <span style={{ color: '#111111', WebkitTextStroke: '0.5px rgba(255,255,255,0.9)' }}>N</span>
          {' '}
          <span style={{ color: '#ef4444' }}>S</span>
          <span style={{ color: '#3b82f6' }}>T</span>
          <span style={{ color: '#22c55e' }}>A</span>
          <span style={{ color: '#facc15' }}>R</span>
          <span style={{ color: '#ffffff' }}>S</span>
          {' '}
          {/* TAEKWONDO ACADEMY - gradient */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-gradient-x">
            TAEKWONDO ACADEMY
          </span>
        </h1>

        {/* Decorative underline */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto animate-pulse mb-8"></div>

        {/* Tagline */}
        <p
          className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90 whitespace-nowrap"
          style={{ fontFamily: 'Garamond, serif' }}
        >
          SPORTS * FITNESS * SELF DEFENCE * DISCIPLINE
        </p>

      </div>
    </header>
  );
};

export default Header;
