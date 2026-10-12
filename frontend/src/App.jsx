import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import DynamicPage from './pages/DynamicPage.jsx';
import Icon from './components/Icon.jsx';
import { useSite } from './SiteContext.jsx';

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Page() {
  const { pathname } = useLocation();
  return <DynamicPage slug={pathname.replace(/^\/+|\/+$/g, '') || 'home'} />;
}

export default function App() {
  const { site } = useSite();
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, '')}` : null;
  return (
    <>
      <ScrollTop />
      <Header />
      <main>
        <Routes><Route path="*" element={<Page />} /></Routes>
      </main>
      <Footer />
      {wa && <a className="float-btn" href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="phone" size={22} /></a>}
    </>
  );
}
