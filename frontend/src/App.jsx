import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Solutions from './pages/Solutions.jsx';
import Industries from './pages/Industries.jsx';
import Contact from './pages/Contact.jsx';
import Careers from './pages/Careers.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <a className="float-btn wa" href="#" aria-label="WhatsApp">✆</a>
      <a className="float-btn chat" href="#" aria-label="Chat">💬</a>
    </>
  );
}
