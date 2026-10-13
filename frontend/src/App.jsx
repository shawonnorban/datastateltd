import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import DynamicPage from './pages/DynamicPage.jsx';
import JobDetail from './pages/JobDetail.jsx';
import PostDetail from './pages/PostDetail.jsx';
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
  const path = pathname.replace(/^\/+|\/+$/g, '') || 'home';
  const detail = path.match(/^(jobs|blogs|news)\/([^/]+)$/);
  if (detail?.[1] === 'jobs') return <JobDetail slug={detail[2]} key={detail[2]} />;
  if (detail) return <PostDetail type={detail[1] === 'news' ? 'news' : 'blog'} slug={detail[2]} key={path} />;
  return <DynamicPage slug={path} />;
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
