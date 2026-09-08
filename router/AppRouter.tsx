import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Navigation } from '../components/Navigation';
import VisionPage from '../pages/VisionPage';
const Journeys = lazy(() => import('../pages/JourneysPage'));
const Explorer = lazy(() => import('../pages/ExplorerPage'));
const Infrastructure = lazy(() => import('../pages/InfrastructurePage'));
const Feasibility = lazy(() => import('../pages/FeasibilityPage'));
function LocationEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = `${pathname === '/' ? 'About the proposal' : pathname === '/explore' ? 'City explorer' : pathname === '/journeys' ? 'Daily journeys' : pathname === '/infrastructure' ? 'How the city works' : 'Project brief'} | Rotunda`;
    if (!hash) window.scrollTo(0, 0);
    else {
      const find = () => document.getElementById(hash.slice(1))?.scrollIntoView();
      find();
      const observer = new MutationObserver(find);
      observer.observe(document.body, { childList: true, subtree: true });
      const timer = setTimeout(() => observer.disconnect(), 4000);
      return () => { observer.disconnect(); clearTimeout(timer); };
    }
  }, [pathname, hash]);
  return null;
}
function Footer() {
  return <footer className="site-footer"><div><Link className="brand" to="/">ROTUNDA</Link><p style={{marginTop:14}}>An independent urban concept. Revision 0.5 · September 2026.<br/>Engineering hypotheses require professional analysis and full-scale testing. Costs and approvals remain to be established.</p></div><div className="footer-links"><Link to="/feasibility#sources">Sources</Link><a href="https://github.com/sagearbor/megaCity-rotating">GitHub ↗</a></div></footer>;
}
export const AppRouter = () => <ThemeProvider><BrowserRouter basename={import.meta.env.BASE_URL}><Navigation/><LocationEffects/><Suspense fallback={<main id="main-content" className="loading-page"><h1>Opening the study…</h1><p>The overview remains available while this section loads.</p><Link className="inline-link" to="/">Back to the vision</Link></main>}><Routes><Route path="/" element={<VisionPage/>}/><Route path="/explore" element={<Explorer/>}/><Route path="/journeys" element={<Journeys/>}/><Route path="/infrastructure" element={<Infrastructure/>}/><Route path="/feasibility" element={<Feasibility/>}/><Route path="*" element={<main className="loading-page"><h1>Page not found</h1><Link className="inline-link" to="/">Return to Rotunda</Link></main>}/></Routes></Suspense><Footer/></BrowserRouter></ThemeProvider>;
