import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import usePageInteractions from './hooks/usePageInteractions';

export default function App() {
  const { pathname } = useLocation();
  const lenisRef = useRef(null);
  usePageInteractions();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis;
    let frame = 0;

    const stop = () => {
      window.cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
      lenisRef.current = null;
    };
    const start = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({ lerp: 0.085 });
      lenisRef.current = lenis;
      const animate = (time) => {
        lenis.raf(time);
        frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    };
    const updateMotionPreference = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    updateMotionPreference();
    reducedMotion.addEventListener('change', updateMotionPreference);
    return () => {
      reducedMotion.removeEventListener('change', updateMotionPreference);
      stop();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('about-page', pathname === '/about');
    if (pathname === '/about') {
      const frame = window.requestAnimationFrame(() => document.body.classList.add('about-page-loaded'));
      return () => window.cancelAnimationFrame(frame);
    }
    document.body.classList.remove('about-page-loaded');
    return undefined;
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Loader />
      <Header />
      <ScrollToTop lenisRef={lenisRef} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <BackToTop lenisRef={lenisRef} />
    </>
  );
}
