import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Orbit } from 'lucide-react';
export const Navigation = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><nav className="site-nav" aria-label="Main navigation">
    <Link className="brand" to="/" aria-label="Rotunda home"><Orbit className="brand-mark"/>ROTUNDA</Link>
    <div className={`nav-links ${open ? 'open' : ''}`} id="main-navigation">
      <NavLink to="/" end>About / vision</NavLink><NavLink to="/explore">City explorer</NavLink><NavLink to="/infrastructure">How it works</NavLink><NavLink to="/feasibility">Project brief</NavLink>
    </div>
    <div className="nav-actions"><button className="icon-button" onClick={() => setIsDarkMode(!isDarkMode)} aria-label={isDarkMode ? 'Use light theme' : 'Use dark theme'}>{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}</button><button className="icon-button mobile-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X size={20}/> : <Menu size={20}/>}</button></div>
  </nav></>;
};
