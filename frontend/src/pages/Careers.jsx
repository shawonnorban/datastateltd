import { useState } from 'react';
import { jobs, perks } from '../data.js';

export default function Careers() {
  const [q, setQ] = useState('');
  const list = jobs.filter((j) => j.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <section className="hero careers">
        <div className="container">
          <span className="badge-pill">We're hiring!</span>
          <h1>Build Your Future <span className="accent">With Us</span></h1>
          <p>Join our team of innovators and help shape the future of software technology.</p>
          <div className="stats">
            <div><b>10+</b><small>Open positions</small></div>
            <div><b>50+</b><small>Team members</small></div>
            <div><b>100+</b><small>Global clients</small></div>
          </div>
          <a href="#openings" className="btn amber">View Openings</a>
        </div>
      </section>
      <section className="section">
        <div className="container center">
          <h2>Why Join Us?</h2>
          <p className="sub">Work on real-world solutions and grow your career</p>
          <div className="grid4">
            {perks.map((p) => (
              <div className="perk" key={p.title}><div className="icon-box round" /><h3>{p.title}</h3><p>{p.text}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt" id="openings">
        <div className="container narrow">
          <div className="form-card">
            <h3>Find Your Perfect Role</h3>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search positions…" />
          </div>
          {list.map((j) => (
            <div className="job" key={j.id}>
              <div>
                <h3>{j.title}</h3>
                <p className="meta">{j.location} · {j.type} · {j.level}</p>
                <p>{j.text}</p>
              </div>
              <div className="job-actions">
                <button className="btn btn-sm outline">View Details</button>
                <button className="btn btn-sm">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
