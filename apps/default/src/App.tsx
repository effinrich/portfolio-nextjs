import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Portfolio } from './pages/Portfolio';
import { CaseStudies } from './pages/CaseStudies';
import { AgentChat } from './pages/AgentChat';

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(10, 9, 8, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(242, 237, 228, 0.06)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--ivory)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          Rich Tillman
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--amber)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          lineHeight: 1,
          opacity: 0.85,
        }}>
          Principal Engineer
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Work
        </NavLink>
        <NavLink to="/case-studies" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Case Studies
        </NavLink>
        <NavLink to="/narrator" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Narrator
        </NavLink>
        <a href="#contact" className="btn-amber" style={{ padding: '9px 18px', fontSize: '0.68rem' }}>
          Hire Me
        </a>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--obsidian)', position: 'relative' }}>
        <div className="ambient-bg" />
        <NavBar />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/narrator" element={<AgentChat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
