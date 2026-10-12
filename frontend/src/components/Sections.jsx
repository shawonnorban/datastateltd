import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon, { iconFor } from './Icon.jsx';
import { Reveal, Counter, useInView } from './Reveal.jsx';
import { useSite } from '../SiteContext.jsx';

/* Render text with <em>…</em> highlighted (the only markup allowed in titles). */
function Rich({ text }) {
  if (!text) return null;
  return text.split(/(<em>.*?<\/em>)/g).map((part, i) =>
    part.startsWith('<em>') ? <em key={i}>{part.slice(4, -5)}</em> : part
  );
}

function Btn({ b }) {
  const cls = `btn ${b.style === 'ghost' ? 'ghost' : ''}`;
  if (b.to?.startsWith('#')) return <a href={b.to} className={cls}>{b.label}</a>;
  return <Link to={b.to || '/'} className={cls}>{b.label} <Icon name="arrow" size={16} /></Link>;
}

function Head({ s, light }) {
  if (!s.title && !s.eyebrow) return null;
  return (
    <Reveal className={`sec-head ${light ? 'light' : ''}`}>
      {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
      {s.title && <h2><Rich text={s.title} /></h2>}
      {s.subtitle && <p className="lead">{s.subtitle}</p>}
    </Reveal>
  );
}

function Hero({ s }) {
  const d = s.data || {};
  const main = d.variant === 'main';
  return (
    <section className={`hero ${main ? 'hero-main' : 'hero-page'}`}>
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" /><div className="grid-bg" />
      <div className="container hero-in">
        <div className="hero-copy">
          {s.eyebrow && <span className="pill">{s.eyebrow}</span>}
          <h1><Rich text={s.title} /></h1>
          {s.subtitle && <p className="hero-sub">{s.subtitle}</p>}
          {!!d.buttons?.length && <div className="btn-row">{d.buttons.map((b) => <Btn key={b.label} b={b} />)}</div>}
          {!!d.stats?.length && (
            <div className="hero-stats">
              {d.stats.map((x) => <div key={x.label}><b>{x.value}</b><span>{x.label}</span></div>)}
            </div>
          )}
        </div>
        {main && (
          <div className="hero-art" aria-hidden="true">
            <div className="orbit o1" /><div className="orbit o2" />
            <div className="core"><Icon name="layers" size={46} /></div>
            {(d.chips || []).map((c, i) => (
              <span key={c} className={`chip chip-${i}`}>{c}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Cards({ s }) {
  const d = s.data || {};
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className={`grid cols-${d.columns || 3}`}>
          {(d.items || []).map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="card glass lift">
                {d.numbered && <span className="ghost-n">0{i + 1}</span>}
                <div className="ico"><Icon name={c.icon} /></div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesGrid({ s }) {
  const { solutions } = useSite();
  const d = s.data || {};
  const list = d.limit ? solutions.slice(0, d.limit) : solutions;
  return (
    <section className="section alt">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-3">
          {list.map((m, i) => (
            <Reveal key={m.title} delay={(i % 3) * 80}>
              <Link to="/contact" className="card module lift">
                <div className="ico grad"><Icon name={iconFor(i)} /></div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <span className="more">Read more <Icon name="arrow" size={15} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        {d.more && <div className="center-row"><Btn b={{ ...d.more, style: 'outline' }} /></div>}
      </div>
    </section>
  );
}

function IndustriesGrid({ s }) {
  const { industries } = useSite();
  const d = s.data || {};
  const list = d.limit ? industries.slice(0, d.limit) : industries;
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-4">
          {list.map((name, i) => (
            <Reveal key={name} delay={(i % 4) * 60}>
              <Link to="/contact" className={`tile tone-${i % 6}`}>
                <span className="tile-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{name}</h3>
                <span className="more">Explore <Icon name="arrow" size={15} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        {d.more && <div className="center-row"><Btn b={{ ...d.more, style: 'outline' }} /></div>}
      </div>
    </section>
  );
}

function Stats({ s }) {
  return (
    <section className="section dark-band">
      <div className="blob b1" /><div className="blob b2" />
      <div className="container">
        <Head s={s} light />
        <div className="grid cols-4">
          {(s.data?.items || []).map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <div className="stat glass-dark">
                <div className="ico light"><Icon name={m.icon} /></div>
                <div className="num"><Counter value={m.value} /><small>+</small></div>
                <div className="lbl">{m.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visual({ kind }) {
  return (
    <div className={`visual v-${kind || 'dashboard'}`} aria-hidden="true">
      {kind === 'shield' || kind === 'network'
        ? <div className="vis-center"><Icon name={kind === 'shield' ? 'shield' : 'globe'} size={64} /></div>
        : (
          <div className="mock">
            <div className="mock-bar"><i /><i /><i /></div>
            <div className="mock-row"><span /><span /><span /></div>
            <div className="mock-chart">{[40, 65, 50, 80, 60, 92, 74].map((h, i) => <b key={i} style={{ height: `${h}%` }} />)}</div>
          </div>
        )}
      <span className="float f1"><Icon name="check" size={18} /> Real-time</span>
      <span className="float f2"><Icon name="zap" size={18} /> Fast</span>
    </div>
  );
}

function Bar({ label, value }) {
  const [ref, seen] = useInView();
  return (
    <div className="bar" ref={ref}>
      <div className="bar-top"><span>{label}</span><span>{value}%</span></div>
      <div className="bar-track"><div style={{ width: seen ? `${value}%` : 0 }} /></div>
    </div>
  );
}

function Split({ s }) {
  const d = s.data || {};
  return (
    <section className="section">
      <div className={`container split ${d.reverse ? 'rev' : ''}`}>
        <Reveal>
          <div className="sec-head left">
            {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
            <h2><Rich text={s.title} /></h2>
            {s.subtitle && <p className="lead">{s.subtitle}</p>}
          </div>
          {!!d.bullets?.length && (
            <ul className="checks">{d.bullets.map((b) => <li key={b}><span><Icon name="check" size={14} /></span>{b}</li>)}</ul>
          )}
          {(d.bars || []).map((b) => <Bar key={b.label} {...b} />)}
          {d.button && <div className="btn-row"><Btn b={d.button} /></div>}
        </Reveal>
        <Reveal delay={120}><Visual kind={d.visual} /></Reveal>
      </div>
    </section>
  );
}

function Showcase({ s }) {
  const items = s.data?.items || [];
  const [i, setI] = useState(0);
  const cur = items[i];
  if (!cur) return null;
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <Reveal>
          <div className="tabs">
            {items.map((it, n) => (
              <button key={it.name} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
                <Icon name={it.icon} size={18} /> {it.name}
              </button>
            ))}
          </div>
          <div className="show card" key={cur.name}>
            <div>
              <h3>{cur.title}</h3>
              <p>{cur.text}</p>
              {cur.button && <div className="btn-row"><Btn b={cur.button} /></div>}
            </div>
            <ul className="show-list">
              {(cur.bullets || []).map((b) => (
                <li key={b}><span><Icon name="check" size={15} /></span>{b}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Steps({ s }) {
  return (
    <section className="section alt">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-3 steps">
          {(s.data?.items || []).map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className={`card step lift tone-${i}`}>
                <div className="step-top"><div className="ico grad"><Icon name={p.icon} /></div><span className="step-n">0{i + 1}</span></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ s }) {
  const { testimonials } = useSite();
  if (!testimonials.length) return null;
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id ?? i} delay={i * 90}>
              <figure className="card quote lift">
                <div className="stars">{'★'.repeat(t.rating || 5)}</div>
                <blockquote>“{t.content}”</blockquote>
                <figcaption>
                  <span className="avatar">{t.client_name?.[0]}</span>
                  <span><b>{t.client_name}</b><small>{[t.client_position, t.company_name].filter(Boolean).join(', ')}</small></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ s }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="section alt">
      <div className="container narrow">
        <Head s={s} />
        {(s.data?.items || []).map((f, i) => (
          <div key={f.q} className={`faq ${open === i ? 'open' : ''}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{f.q}</span><Icon name="plus" size={18} />
            </button>
            <div className="faq-a"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Cta({ s }) {
  return (
    <section className="section cta-wrap">
      <div className="container">
        <Reveal>
          <div className="cta">
            <div className="blob b1" /><div className="blob b2" />
            <h2><Rich text={s.title} /></h2>
            {s.subtitle && <p>{s.subtitle}</p>}
            <div className="btn-row center">{(s.data?.buttons || []).map((b) => <Btn key={b.label} b={b} />)}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Branches({ s }) {
  const { site } = useSite();
  return (
    <section className="section alt">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-3">
          {site.branches.map((b, i) => (
            <Reveal key={b.name} delay={(i % 3) * 80}>
              <div className="card branch lift">
                <div className="ico grad"><Icon name="pin" /></div>
                <h3>{b.name}</h3>
                <p>{b.address}</p>
                {b.phone && <p className="line"><Icon name="phone" size={15} /> {b.phone}</p>}
                {b.email && <p className="line"><Icon name="mail" size={15} /> {b.email}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm({ s }) {
  const d = s.data || {};
  const [state, setState] = useState('idle');
  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target));
    setState('sending');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setState('sent');
      e.target.reset();
    } catch { setState('error'); }
  };
  return (
    <section className="section" id={s.key.endsWith('-demo') ? 'demo' : undefined}>
      <div className="container split">
        <Reveal>
          <div className="sec-head left">
            {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
            <h2><Rich text={s.title} /></h2>
            {s.subtitle && <p className="lead">{s.subtitle}</p>}
          </div>
          <ul className="checks">{(d.bullets || []).map((b) => <li key={b}><span><Icon name="check" size={14} /></span>{b}</li>)}</ul>
        </Reveal>
        <Reveal delay={120}>
          <form className="card form glass" onSubmit={submit}>
            <span className="eyebrow">Free consultation</span>
            <h3>Make An Appointment</h3>
            <p className="muted">Share a few details — our team will reach out within 24 hours.</p>
            <select name="interest" defaultValue="">
              <option value="" disabled>What are you looking for?</option>
              {(d.options || []).map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="row2"><input name="name" placeholder="Your name" required /><input name="phone" placeholder="Phone" /></div>
            <input name="email" type="email" placeholder="Email" required />
            <input name="company" placeholder="Company name" />
            <textarea name="message" rows="3" placeholder="Your message" />
            <button className="btn block" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Submit request'} <Icon name="arrow" size={16} />
            </button>
            {state === 'sent' && <p className="ok">Thank you! We will contact you within 24 hours.</p>}
            {state === 'error' && <p className="err">Could not send. Please try again.</p>}
            <small className="muted">100% confidential · Reply within 24h</small>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Jobs({ s }) {
  const [q, setQ] = useState('');
  const items = (s.data?.items || []).filter((j) => j.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="section alt" id="openings">
      <div className="container narrow">
        <Head s={s} />
        <div className="search card glass">
          <Icon name="eye" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search positions…" />
        </div>
        {items.map((j) => (
          <Reveal key={j.title}>
            <div className="job card lift">
              <div>
                <h3>{j.title}</h3>
                <div className="tags"><span>{j.location}</span><span>{j.type}</span><span>{j.level}</span></div>
                <p>{j.text}</p>
              </div>
              <div className="btn-row">
                <Link to="/contact" className="btn sm">Apply now</Link>
              </div>
            </div>
          </Reveal>
        ))}
        {!items.length && <p className="center muted">No positions match your search.</p>}
      </div>
    </section>
  );
}

const map = {
  hero: Hero, cards: Cards, services_grid: ServicesGrid, industries_grid: IndustriesGrid, stats: Stats,
  split: Split, showcase: Showcase, steps: Steps, testimonials: Testimonials, faq: Faq, cta: Cta,
  branches: Branches, contact_form: ContactForm, jobs: Jobs,
};

export default function Section({ section }) {
  const C = map[section.type];
  return C ? <C s={section} /> : null;
}
