import { Link } from 'react-router-dom';
import { footerCols } from '../data.js';
import Icon from './Icon.jsx';
import { useSite } from '../SiteContext.jsx';

export default function Footer() {
  const { site } = useSite();
  const social = [['facebook', 'f'], ['twitter', 't'], ['linkedin', 'in'], ['youtube', '▶']];
  return (
    <>
      {!!site.memberships?.length && (
        <section className="section certs">
          <div className="container">
            <div className="sec-head"><h2>Certifications and Membership</h2></div>
            <div className="cert-row">
              {site.memberships.map((m) => {
                const inner = m.image_url
                  ? <img src={m.image_url} alt={m.full_name || m.name} title={m.full_name || m.name} loading="lazy" />
                  : <><b>{m.name}</b><span>{m.full_name}</span></>;
                return m.url
                  ? <a className={`cert ${m.image_url ? 'cert-img' : ''}`} key={m.name} href={m.url} target="_blank" rel="noreferrer">{inner}</a>
                  : <div className={`cert ${m.image_url ? 'cert-img' : ''}`} key={m.name}>{inner}</div>;
              })}
            </div>
          </div>
        </section>
      )}
      <footer className="footer">
        <div className="container">
          {site.map_embed_url && (
            <div className="map-wrap">
              <iframe className="map" title="Map" src={site.map_embed_url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              {site.map_link && <a className="map-open" href={site.map_link} target="_blank" rel="noreferrer">Open in Maps ↗</a>}
            </div>
          )}
          <div className="footer-grid">
            <div>
              <h4>Contact Us</h4>
              {site.full_name && <p className="full-name">{site.full_name}</p>}
              <p className="muted-blue">{site.tagline}</p>
              {site.address && <p className="line"><Icon name="pin" size={15} /> <span><b>Corporate Head Office:</b><br />{site.address}</span></p>}
              {site.phone && <p className="line"><Icon name="phone" size={15} /> <span><b>Telephone (Office):</b><br />{site.phone}</span></p>}
              {site.email && <p className="line"><Icon name="mail" size={15} /> <span><b>Email:</b><br />{site.email}</span></p>}
              <div className="social">
                {social.filter(([k]) => site.social?.[k]).map(([k, l]) => (
                  <a key={k} href={site.social[k]} target="_blank" rel="noreferrer">{l}</a>
                ))}
              </div>
            </div>
            {Object.entries(footerCols).map(([title, items]) => (
              <div key={title}>
                <h4>{title}</h4>
                <ul>{items.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
          {!!site.legal?.length && (
            <div className="legal">
              <h4>Legal</h4>
              {site.legal.map((l) => <p key={l}>{l}</p>)}
            </div>
          )}
        </div>
        <div className="copy">© All rights reserved by {site.name} - {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}
