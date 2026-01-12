import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navBg = isDarkMode
    ? "bg-slate-900/80 border-slate-700"
    : "bg-white/80 border-slate-200";

  const linkBase = isDarkMode
    ? "hover:text-sky-400"
    : "hover:text-sky-600";

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: ROUTES.HOME, label: "City View" },
    { path: ROUTES.INFRASTRUCTURE, label: "Infrastructure" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b z-30 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">Rotunda</h1>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm transition-colors ${linkBase} ${
                  isActive(path)
                    ? isDarkMode ? 'text-sky-400 font-semibold' : 'text-sky-600 font-semibold'
                    : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {label}
                {isActive(path) && (
                  <div className={`h-0.5 mt-1 ${isDarkMode ? 'bg-sky-400' : 'bg-sky-600'}`} />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-slate-700'
            }`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0 ${navBg} border-b`}>
          <div className="p-4 space-y-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  isActive(path)
                    ? isDarkMode ? 'bg-sky-900 text-sky-400' : 'bg-sky-100 text-sky-600'
                    : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
