import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative py-16 md:py-24">
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">

        {/* Tagline only */}
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
