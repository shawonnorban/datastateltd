import { Link } from 'react-router-dom';
import { useSite } from '../SiteContext.jsx';

export default function Solutions() {
  const { solutions } = useSite();
  return (
    <>
      <section className="hero small">
        <div className="container">
          <span className="eyebrow light">Solutions</span>
          <h1>Software Solutions &amp; Modules for Businesses</h1>
          <p>Streamline accounting, inventory, sales, HRM, CRM and operations.</p>
          <Link to="/contact" className="btn">Request a Demo →</Link>
        </div>
      </section>
      <section className="section">
        <div className="container center">
          <h2>Features And Modules</h2>
          <span className="eyebrow">We specialize in building awesome features</span>
          <div className="grid3">
            {solutions.map((s) => (
              <div className="module" key={s.title}>
                <div className="icon-box" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <button className="btn btn-sm">Read more →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
