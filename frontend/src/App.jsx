import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import DynamicPage from './pages/DynamicPage.jsx';
import Icon from './components/Icon.jsx';
import { useSite } from './SiteContext.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

const pages = { '/': 'home', '/about': 'about', '/solutions': 'solutions', '/ai': 'ai', '/industries': 'industries', '/contact': 'contact', '/careers': 'careers' };

export default function App() {
  const { site } = useSite();
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, '')}` : null;
  return (
    <>
      <ScrollTop />
      <Header />
      <main>
        <Routes>
          {Object.entries(pages).map(([path, slug]) => (
            <Route key={path} path={path} element={<DynamicPage slug={slug} />} />
          ))}
          <Route path="*" element={<DynamicPage slug="home" />} />
        </Routes>
      </main>
      <Footer />
      {wa && <a className="float-btn" href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="phone" size={22} /></a>}
    </>
  );
}
