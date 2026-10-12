import { Link } from 'react-router-dom';
import Metrics from '../components/Metrics.jsx';
import Process from '../components/Process.jsx';
import { industries, solutions } from '../data.js';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow light">Software Solutions</span>
          <h1>Software Solutions &amp; Modules for Modern Businesses</h1>
          <p>Streamline accounting, inventory, sales, HRM, CRM and business operations with flexible software.</p>
          <Link to="/contact" className="btn">Request a Demo →</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid3 cards-num">
            {['Our Mission & Commitment', 'Our Vision', 'Our Experience'].map((t, i) => (
              <div className="info-card" key={t}>
                <span className="big-n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>Timely delivery and exceptional service quality, fostering a community of satisfied clients.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container center">
          <span className="eyebrow">We specialize in building awesome features</span>
          <h2>Software Features And Modules</h2>
          <div className="grid3">
            {solutions.slice(0, 9).map((s) => (
              <div className="module" key={s.title}>
                <div className="icon-box" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Link to="/solutions" className="btn btn-sm">Read more →</Link>
              </div>
            ))}
          </div>
          <Link to="/solutions" className="btn outline mt">All Solutions</Link>
        </div>
      </section>

      <section className="section alt">
        <div className="container center">
          <span className="eyebrow">Industries</span>
          <h2>Industry-Wise Software Solutions</h2>
          <div className="grid3">
            {industries.slice(0, 6).map((i) => (
              <Link to="/industries" className="photo-card" key={i}><span>{i}</span></Link>
            ))}
          </div>
        </div>
      </section>

      <Metrics />
      <Process />

      <section className="section alt">
        <div className="container center">
          <h2>What Industry Leaders Say</h2>
          <blockquote className="quote">
            “The implementation cut our month-end closing cycle significantly. Outstanding support.”
            <footer>Client Name — Finance Manager</footer>
          </blockquote>
        </div>
      </section>
    </>
  );
}
