import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed right-3 bottom-3 md:top-4 md:right-4 md:bottom-auto z-50 px-4 py-3 md:px-3 md:py-2 rounded-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300 dark:border-gray-700 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500/60 backdrop-blur-sm flex items-center gap-2"
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-5 h-5 md:w-4 md:h-4 text-gray-900" />
          <span className="hidden sm:inline text-sm font-semibold text-gray-900">Escuro</span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5 md:w-4 md:h-4 text-yellow-400" />
          <span className="hidden sm:inline text-sm font-semibold text-yellow-400">Claro</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
