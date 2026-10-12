import { Link } from 'react-router-dom';
import { footerCols, site } from '../data.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="map">Map placeholder — embed Google Maps here</div>
        <div className="footer-grid">
          <div>
            <h4>Contact</h4>
            <p className="muted-blue">{site.tagline}</p>
            <p>✆ {site.phone}</p>
            <p>✉ {site.email}</p>
            <div className="social"><span>f</span><span>t</span><span>in</span><span>▶</span></div>
          </div>
          {Object.entries(footerCols).map(([title, items]) => (
            <div key={title}>
              <h4>{title}</h4>
              <ul>{items.map((i) => <li key={i}><Link to="/">{i}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="copy">© All rights reserved by {site.name} - {new Date().getFullYear()}</div>
    </footer>
  );
}
