import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-300 dark:border-gray-700 hover:scale-105 flex items-center space-x-2 backdrop-blur-sm"
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4 text-gray-800 dark:text-gray-300" style={{ color: '#000000' }} />
          <span className="text-sm font-semibold text-black dark:text-gray-300" style={{ color: '#000000' }}>Escuro</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-500 dark:text-yellow-400">Claro</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
