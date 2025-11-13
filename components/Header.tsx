
import React from 'react';
import { ActiveView } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onToggleSidebar }) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-brand-white border-b border-brand-lavender/50 sticky top-0 z-30">
      <button onClick={onToggleSidebar} className="p-2 -ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <h1 className="text-lg font-semibold font-serif-display">{activeView}</h1>
      <div className="w-8"></div> {/* Spacer to balance the title */}
    </header>
  );
};

export default Header;
