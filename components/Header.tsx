import React from 'react';
import { SortOption } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, onSearchChange, 
  sortOption, onSortChange,
  isDarkMode, onToggleDarkMode
}) => {
  return (
    <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
            <i className="fas fa-book-open text-primary-500 text-2xl"></i>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">NIRO NOTES</h1>
        </div>
        
        <div className="flex-1 min-w-[200px] max-w-md flex items-center justify-center">
            <div className="relative w-full">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-full py-2 pl-10 pr-4 transition"
                />
            </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-md py-2 pl-3 pr-8 transition cursor-pointer"
              aria-label="Sort notes"
            >
              <option value={SortOption.LAST_MODIFIED}>Sort: Modified</option>
              <option value={SortOption.CREATED_AT}>Sort: Created</option>
              <option value={SortOption.TITLE}>Sort: Title</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>

          <button onClick={onToggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Toggle dark mode">
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl text-slate-600 dark:text-slate-300`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;