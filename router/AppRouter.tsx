import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Navigation } from '../components/Navigation';
import HomePage from '../pages/HomePage';
import InfrastructurePage from '../pages/InfrastructurePage';
import { ROUTES } from './routes';

export const AppRouter: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.INFRASTRUCTURE} element={<InfrastructurePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
