import { useState, useEffect } from 'react';
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

function ItemLink({ to, className, children }) {
  return to ? <Link to={to} className={className}>{children}</Link> : <div className={className}>{children}</div>;
}

function Btn({ b }) {
  const cls = `btn ${b.style === 'ghost' ? 'ghost' : ''}`;
  if (b.to?.startsWith('#')) return <a href={b.to} className={cls}>{b.label}</a>;
  if (/^https?:/.test(b.to || '')) return <a href={b.to} className={cls} target="_blank" rel="noreferrer">{b.label}</a>;
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
  const { site } = useSite();
  const main = d.variant === 'main';
  const img = d.image_url || site.hero_banner_url;
  return (
    <section className={`hero ${main ? 'hero-main' : 'hero-page'} ${img ? 'has-img' : ''}`}>
      {img && <div className="hero-img" style={{ backgroundImage: `url(${img})` }} />}
      {img ? <div className="hero-shade" /> : <><div className="blob b1" /><div className="blob b2" /><div className="blob b3" /></>}
      <div className="grid-bg" />
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
                <div className="ico"><Icon name={c.icon || iconFor(i)} /></div>
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
              <ItemLink to={m.to} className="card module lift">
                <div className="ico grad"><Icon name={iconFor(i)} /></div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                {m.to && <span className="more">Read more <Icon name="arrow" size={15} /></span>}
              </ItemLink>
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
          {list.map((it, i) => (
            <Reveal key={it.name} delay={(i % 4) * 60}>
              <ItemLink to={it.to} className={`tile tone-${i % 6}`}>
                <span className="tile-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{it.name}</h3>
                {it.text && <p className="tile-p">{it.text}</p>}
                {it.to && <span className="more">Explore <Icon name="arrow" size={15} /></span>}
              </ItemLink>
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
                <div className="ico light"><Icon name={m.icon || iconFor(i + 8)} /></div>
                <div className="num">{(() => {
                  const mm = String(m.value).match(/^([^\d]*)([\d,.]+)(.*)$/);
                  return mm ? <>{mm[1]}<Counter value={mm[2].replace(/,/g, '')} /><small>{mm[3]}</small></> : m.value;
                })()}</div>
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
            <div className="faq-a"><p>{f.a}</p>{f.button && <div className="faq-btn"><Btn b={{ ...f.button, style: 'outline' }} /></div>}</div>
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
    if (body.country) { body.message = `Country: ${body.country}\n${body.message || ''}`.trim(); }
    delete body.country;
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
              <option value="" disabled>{d.select_label || 'What are you looking for?'}</option>
              {(d.options || []).map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="row2"><input name="name" placeholder="Your name" required /><input name="phone" placeholder="Phone" /></div>
            {!!d.countries?.length && (
              <select name="country" defaultValue="">
                <option value="" disabled>Select country</option>
                {d.countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            )}
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

function ApplyModal({ job, onClose }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append('position', job.title);
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/job-applications', { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      if (res.status === 422) {
        const j = await res.json();
        setError(Object.values(j.errors || {})[0]?.[0] || 'Please check the form.');
        setState('idle'); return;
      }
      if (!res.ok) throw new Error();
      setState('sent');
    } catch { setError('Could not submit. Please try again.'); setState('idle'); }
  };
  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close">×</button>
        <span className="eyebrow">Apply for position</span>
        <h3>{job.title}</h3>
        {state === 'sent' ? (
          <div className="sent"><div className="ico grad"><Icon name="check" /></div><p className="ok">Application received. Thank you! We will contact you if you are shortlisted.</p><button className="btn sm" onClick={onClose}>Close</button></div>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>Full Name *<input name="name" required placeholder="Your full name" /></label>
            <label>Email Address *<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Phone Number *<input name="phone" required placeholder="+8801XXXXXXXXX" /></label>
            <label>Upload Your CV * <small className="muted">(PDF, DOC or DOCX, max 5 MB)</small>
              <input name="cv" type="file" required accept=".pdf,.doc,.docx,application/pdf" />
            </label>
            <label>Cover note<textarea name="cover_note" rows="3" placeholder="Tell us briefly about yourself" /></label>
            {error && <p className="err">{error}</p>}
            <button className="btn block" disabled={state === 'sending'}>{state === 'sending' ? 'Submitting…' : 'Submit application'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Jobs({ s }) {
  const [q, setQ] = useState('');
  const [applying, setApplying] = useState(null);
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
                <div className="tags"><span>{j.location}</span><span>{j.type}</span><span>{j.level}</span>{j.posted && <span className="soft">{j.posted}</span>}{j.applicants && <span className="soft">{j.applicants}</span>}</div>
                <p>{j.text}</p>
              </div>
              <div className="btn-row">
                <button className="btn sm" onClick={() => setApplying(j)}>Apply Now</button>
              </div>
            </div>
          </Reveal>
        ))}
        {!items.length && <p className="center muted">No positions match your search.</p>}
        {applying && <ApplyModal job={applying} onClose={() => setApplying(null)} />}
      </div>
    </section>
  );
}

function Block({ b, first }) {
  if (b.k === 'p') return <p className={first ? 'lead-p' : 'prose'}>{b.text}</p>;
  if (b.k === 'button') return <div className="btn-row"><Btn b={b} /></div>;
  if (b.k === 'list') {
    return (
      <ul className="checks">
        {b.items.map((it) => (
          <li key={it.text}><span><Icon name="check" size={14} /></span>
            {it.to ? <Link to={it.to}>{it.text}</Link> : it.text}</li>
        ))}
      </ul>
    );
  }
  if (b.k === 'tiles') {
    return (
      <div className="grid cols-4 tiles">
        {b.items.map((it, i) => (
          <Reveal key={it.title} delay={(i % 4) * 50}>
            <ItemLink to={it.to} className={`tile sm tone-${i % 6}`}>
              <span className="tile-n">{String(i + 1).padStart(2, '0')}</span><h3>{it.title}</h3>
            </ItemLink>
          </Reveal>
        ))}
      </div>
    );
  }
  if (b.k === 'stats') {
    return (
      <div className="grid cols-4">
        {b.items.map((m) => (
          <div className="stat plain" key={m.label}><div className="num">{m.value}</div><div className="lbl">{m.label}</div></div>
        ))}
      </div>
    );
  }
  if (b.k === 'cards') {
    const n = b.items.length;
    const cols = n === 4 || n === 8 ? 4 : n === 2 ? 2 : 3;
    return (
      <div className={`grid cols-${cols}`}>
        {b.items.map((c, i) => {
          const paras = Array.isArray(c.text) ? c.text : c.text ? [c.text] : [];
          return (
            <Reveal key={c.title} delay={(i % cols) * 70}>
              <div className="card glass lift">
                {b.numbered && <span className="ghost-n">0{i + 1}</span>}
                <div className="ico"><Icon name={iconFor(i)} /></div>
                <h3>{c.title}</h3>
                {paras.map((p) => <p key={p}>{p}</p>)}
                {!!c.bullets?.length && <ul className="checks sm">{c.bullets.map((x) => <li key={x}><span><Icon name="check" size={12} /></span>{x}</li>)}</ul>}
                {c.button && <div className="btn-row"><Btn b={{ ...c.button, style: 'outline' }} /></div>}
              </div>
            </Reveal>
          );
        })}
      </div>
    );
  }
  return null;
}

const visuals = ['dashboard', 'network', 'shield'];
function Article({ s }) {
  const blocks = s.data?.blocks || [];
  const wide = blocks.some((b) => ['cards', 'tiles', 'stats'].includes(b.k));
  const alt = blocks.some((b) => b.k === 'cards') ? 'alt' : '';
  const idx = Number(s.id) || 0;

  if (!wide) {
    return (
      <section className="section">
        <div className={`container split ${idx % 2 ? 'rev' : ''}`}>
          <Reveal>
            <div className="sec-head left">
              {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
              {s.title && <h2><Rich text={s.title} /></h2>}
              {s.subtitle && <p className="lead">{s.subtitle}</p>}
            </div>
            <div className="art">
              {blocks.map((b, i) => <Block key={i} b={b} first={i === 0 && b.k === 'p'} />)}
            </div>
          </Reveal>
          <Reveal delay={120}><Visual kind={visuals[idx % 3]} /></Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className={`section ${alt}`}>
      <div className="container">
        <Head s={s} />
        <div className="art-wide">
          {blocks.map((b, i) => (b.k === 'p'
            ? <p key={i} className="lead center-lead">{b.text}</p>
            : <Block key={i} b={b} />))}
        </div>
      </div>
    </section>
  );
}

function Quotes({ s }) {
  const items = s.data?.items || [];
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 90}>
              <figure className="card quote lift">
                <div className="stars">{'★'.repeat(t.rating || 5)}</div>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <span className="avatar">{t.name?.[0]}</span>
                  <span><b>{t.name}</b><small>{t.role}</small></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Posts({ s }) {
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className="grid cols-3">
          {(s.data?.items || []).map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 80}>
              <ItemLink to={p.to} className="card post lift">
                {p.category && <span className="tag">{p.category}</span>}
                <h3>{p.title}</h3>
                {p.text && <p>{p.text}</p>}
                <div className="post-meta">{[p.date, p.read].filter(Boolean).join(' · ')}</div>
                {p.to && <span className="more">Read more <Icon name="arrow" size={15} /></span>}
              </ItemLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clients({ s }) {
  return (
    <section className="section alt">
      <div className="container">
        <Head s={s} />
        <div className="client-grid">
          {(s.data?.items || []).map((n, i) => <Reveal key={n} delay={(i % 6) * 40}><div className="client">{n}</div></Reveal>)}
        </div>
      </div>
    </section>
  );
}

const map = {
  article: Article, quotes: Quotes, posts: Posts, clients: Clients,
  hero: Hero, cards: Cards, services_grid: ServicesGrid, industries_grid: IndustriesGrid, stats: Stats,
  split: Split, showcase: Showcase, steps: Steps, testimonials: Testimonials, faq: Faq, cta: Cta,
  branches: Branches, contact_form: ContactForm, jobs: Jobs,
};

export default function Section({ section }) {
  const C = map[section.type];
  return C ? <C s={section} /> : null;
}
