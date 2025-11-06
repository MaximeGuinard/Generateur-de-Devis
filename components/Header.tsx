import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#1a3638]/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
        <img 
          src="https://devsource.fr/wp-content/uploads/2025/07/DS_logo_petit_cercle_noeffect.png" 
          alt="Devsource Logo"
          className="h-12 w-auto" 
        />
      </div>
    </header>
  );
};

export default Header;