import { Link } from 'react-router-dom';
import { industries } from '../data.js';
import Metrics from '../components/Metrics.jsx';
import Process from '../components/Process.jsx';

export default function Industries() {
  return (
    <>
      <section className="hero small">
        <div className="container">
          <span className="eyebrow light">Industries</span>
          <h1>Industry-Wise Software Solutions</h1>
          <p>Smart software solutions built to fit your industry, scale and workflow.</p>
          <Link to="/contact" className="btn">Request a Demo</Link>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid3">
            {industries.map((i) => (
              <div className="photo-card" key={i}>
                <span>{i}</span>
                <Link to="/contact" className="btn btn-sm">Read more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Metrics />
      <Process />
    </>
  );
}
