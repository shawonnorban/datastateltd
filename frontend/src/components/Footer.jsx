import { Link } from 'react-router-dom';
import { footerCols } from '../data.js';
import { useSite } from '../SiteContext.jsx';

export default function Footer() {
  const { site } = useSite();
  const social = [['facebook', 'f'], ['twitter', 't'], ['linkedin', 'in'], ['youtube', '▶']];
  return (
    <footer className="footer">
      <div className="container">
        {site.map_embed_url
          ? <iframe className="map" title="Map" src={site.map_embed_url} loading="lazy" />
          : <div className="map">{site.address || 'Map'}</div>}
        <div className="footer-grid">
          <div>
            <h4>Contact</h4>
            <p className="muted-blue">{site.tagline}</p>
            {site.address && <p>⌖ {site.address}</p>}
            <p>✆ {site.phone}</p>
            <p>✉ {site.email}</p>
            <div className="social">
              {social.filter(([k]) => site.social?.[k]).map(([k, l]) => (
                <a key={k} href={site.social[k]} target="_blank" rel="noreferrer">{l}</a>
              ))}
            </div>
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
