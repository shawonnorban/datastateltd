import { useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import { useSite } from '../SiteContext.jsx';

export default function Contact() {
  const { site } = useSite();
  const branches = site.branches;
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setFailed(true);
    }
  };
  return (
    <>
      <PageHero badge="Get in touch" title="Contact Us" crumb="Contact" sub="Explore the latest features, products, and services." />
      <section className="section">
        <div className="container split">
          <div>
            <h2>We Provide Best Software Solution</h2>
            <ul className="checks">
              <li>Enterprise Systems</li>
              <li>Workforce Management</li>
              <li>Client &amp; Supplier Relationship Strategies</li>
            </ul>
          </div>
          <form className="form-card" onSubmit={submit}>
            <span className="eyebrow">Free consultation</span>
            <h3>Make An Appointment</h3>
            <p className="sub">Share a few details — our team will reach out within 24 hours.</p>
            <select name="interest" defaultValue=""><option value="" disabled>What are you looking for?</option><option>Demo</option><option>Pricing</option><option>Support</option></select>
            <div className="row2"><input name="name" placeholder="Your Name" required /><input name="phone" placeholder="Phone" /></div>
            <input name="email" type="email" placeholder="Email" required />
            <input name="company" placeholder="Company Name" />
            <textarea name="message" placeholder="Your Message" rows="3" />
            <button className="btn block" disabled={sent}>{sent ? 'Thank you!' : 'Submit Request →'}</button>
            {failed && <small style={{ color: '#b91c1c' }}>Could not send. Please try again.</small>}
            <small className="sub">100% Confidential · Reply within 24h</small>
          </form>
        </div>
      </section>
      <section className="section">
        <div className="container center">
          <h2>Our Branches</h2>
          <p className="sub">Find our office locations.</p>
          <div className="grid3 left">
            {branches.map((b) => (
              <div className="branch" key={b.name}>
                <div className="icon-box sm" />
                <h3>{b.name}</h3>
                <p>{b.address}</p>
                <p>✆ {b.phone}</p>
                <p>✉ {b.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
