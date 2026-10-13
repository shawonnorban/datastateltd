import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon, { iconFor } from './Icon.jsx';
import { BrandMark, PayBadge } from './BrandIcon.jsx';
import { PostCard } from '../pages/PostDetail.jsx';
import { fmtDate, getJson, timeAgo } from '../lib.js';
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
  const cls = `btn ${b.style === 'ghost' ? 'ghost' : ''} ${b.style === 'outline' ? 'outline' : ''} ${b.style === 'amber' ? 'amber' : ''}`;
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

function HeroLight({ s }) {
  const d = s.data || {};
  const o = d.offer;
  return (
    <section className="hero-light">
      <div className="grid-bg light" />
      <div className="container">
        <div className="hero-light-copy">
          {s.eyebrow && <span className="pill dark">{s.eyebrow}</span>}
          <h1><Rich text={s.title} /></h1>
          {s.subtitle && <p className="hero-sub">{s.subtitle}</p>}
          {!!d.buttons?.length && <div className="btn-row center">{d.buttons.map((b) => <Btn key={b.label} b={b} />)}</div>}
        </div>
        {o && (
          <div className="offer card">
            <div className="offer-bar"><i /><i /><i /><span className="url">{o.url}</span><span className="chip-blue">{o.badge}</span></div>
            <div className="offer-body">
              <div>
                <span className="chip-blue">{o.chip}</span>
                <h3>{o.plan}</h3>
                <p className="muted">{o.text}</p>
                <div className="offer-price"><b>{o.price}</b><span>{o.per}</span><s>{o.old}</s><em className="save">{o.save}</em></div>
                <div className="btn-row"><Btn b={o.cta} /><span className="guarantee"><Icon name="shield" size={16} /> {o.guarantee}</span></div>
              </div>
              <div className="included">
                <div className="included-top"><b>{o.included_title}</b><span>{o.included_note}</span></div>
                <ul>{(o.included || []).map((x) => <li key={x}><Icon name="check" size={15} />{x}</li>)}</ul>
                <div className="tags-row">{(o.tags || []).map((x) => <span key={x}>{x}</span>)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Hero({ s }) {
  const d = s.data || {};
  const { site } = useSite();
  if (d.variant === 'light') return <HeroLight s={s} />;
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
  const dark = s.data?.dark;
  return (
    <section className={`section ${dark ? 'dark-band steps-dark' : 'alt'}`}>
      {dark && <><div className="blob b1" /><div className="blob b2" /></>}
      <div className="container">
        <Head s={s} light={dark} />
        <div className="grid cols-3 steps">
          {(s.data?.items || []).map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className={`card step lift tone-${i}`}>
                <div className="step-top"><div className="ico grad"><Icon name={p.icon} /></div><span className="step-n">0{i + 1}</span></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                {p.note && <div className="step-note"><Icon name="check" size={15} /> {p.note}</div>}
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

const taka = (n) => (n == null || n === '' ? '' : `৳${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`);

function useHosting() {
  const [h, setH] = useState({ plans: [], tlds: [] });
  useEffect(() => {
    let alive = true;
    fetch('/api/hosting', { headers: { Accept: 'application/json' } }).then((r) => r.json()).then((d) => alive && setH(d)).catch(() => {});
    return () => { alive = false; };
  }, []);
  return h;
}

function Strip({ s }) {
  return (
    <div className="strip">
      <div className="container strip-in">
        <span className="strip-title"><i />{s.title}</span>
        <ul>{(s.data?.items || []).map((x) => {
          const name = typeof x === 'string' ? x : x.name;
          return <li key={name}><BrandMark name={name} logo={typeof x === 'string' ? null : x.logo} size={20} />{name}</li>;
        })}</ul>
      </div>
    </div>
  );
}

function DomainSearch({ s }) {
  const d = s.data || {};
  const { tlds } = useHosting();
  const [name, setName] = useState('');
  const [ext, setExt] = useState('');
  const sel = ext || tlds[0]?.extension || '.com';
  const go = (e) => {
    e.preventDefault();
    const domain = `${name.replace(/\..*$/, '').trim()}${sel}`;
    if (name.trim()) window.location.assign(`${d.order_url || '/company/request-demo'}?domain=${encodeURIComponent(domain)}`);
  };
  return (
    <section className="section alt" id="domain-search">
      <div className="container">
        <Head s={s} />
        <div className="domain-box card">
          <form className="domain-form" onSubmit={go}>
            <div className="domain-input"><Icon name="eye" size={18} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder={d.placeholder || 'Type your desired domain name'} /></div>
            <select value={sel} onChange={(e) => setExt(e.target.value)} aria-label="Extension">{tlds.map((t) => <option key={t.id}>{t.extension}</option>)}</select>
            <button className="btn dark">{d.button || 'Search'}</button>
          </form>
          <div className="tld-row">
            {tlds.map((t) => (
              <button type="button" key={t.id} className={`tld ${sel === t.extension ? 'on' : ''}`} onClick={() => setExt(t.extension)}>
                <b>{t.extension}</b> <span>{taka(t.price)}/yr</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Combo({ s }) {
  const d = s.data || {};
  return (
    <section className="section combo-wrap">
      <div className="container">
        <Reveal>
          <div className="combo">
            <div>
              {s.eyebrow && <span className="combo-badge">{s.eyebrow}</span>}
              <h2><Rich text={s.title} /></h2>
              {s.subtitle && <p>{s.subtitle}</p>}
            </div>
            {d.button && <Btn b={{ ...d.button, style: 'amber' }} />}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PricingPlans({ s }) {
  const d = s.data || {};
  const { plans } = useHosting();
  const cycles = d.cycles || [{ key: 'yearly', label: 'Yearly', suffix: '/year' }];
  const [cycle, setCycle] = useState(d.default || cycles[0].key);
  const cur = cycles.find((c) => c.key === cycle) || cycles[0];
  const price = (p) => ({ monthly: p.price_monthly, yearly: p.price_yearly, triennial: p.price_triennial }[cur.key]);
  const strike = (p) => (cur.key === 'yearly' ? p.old_price_yearly : cur.key === 'triennial' && p.old_price_yearly ? p.old_price_yearly * 3 : null);
  const perMonth = (p) => (cur.key === 'yearly' ? p.price_yearly / 12 : cur.key === 'triennial' ? p.price_triennial / 36 : null);
  const order = (p) => p.order_url || '/company/request-demo';

  return (
    <section className="section" id="pricing">
      <div className="container">
        <Head s={s} />
        <div className="cycle-wrap"><div className="cycle">
          {cycles.map((c) => <button key={c.key} className={c.key === cur.key ? 'on' : ''} onClick={() => setCycle(c.key)}>{c.label}</button>)}
        </div></div>
        <div className="grid plans">
          {plans.map((p) => (
            <div key={p.id} className={`plan card ${p.is_popular ? 'popular' : ''}`}>
              {p.is_popular && <span className="plan-badge">★ {p.badge || 'Most Popular'}</span>}
              <div className="plan-head"><h3>{p.name}</h3>{p.discount_label && <span className="off">{p.discount_label}</span>}</div>
              <p className="muted plan-tag">{p.tagline}</p>
              {strike(p) ? <div className="strike"><s>{taka(strike(p))}{cur.suffix}</s> {p.discount_label && <em>Save {p.discount_label.replace(' OFF', '')} Discount</em>}</div> : <div className="strike">&nbsp;</div>}
              <div className="plan-price"><b>{taka(price(p))}</b><span>{cur.suffix}</span></div>
              <p className="muted plan-eq">{perMonth(p) ? `Equates to ${taka(perMonth(p))}/month${p.discount_label ? ` • ${p.discount_label}` : ''}` : '\u00a0'}</p>
              <Link to={order(p)} className={`btn block ${p.is_popular ? '' : 'dark'}`}>{d.order_label || 'Order Now'} <Icon name="arrow" size={16} /></Link>
              <div className="inc-title">Included resources:</div>
              <ul className="inc">{(p.features || []).map((f) => <li key={f}><Icon name="check" size={15} />{f}</li>)}</ul>
            </div>
          ))}
        </div>
        {d.guarantee && <div className="guar"><Icon name="shield" size={18} /> {d.guarantee}</div>}
      </div>
    </section>
  );
}

function SpecTable({ s }) {
  const { plans } = useHosting();
  if (!plans.length) return null;
  const rows = Object.keys(plans[0].specs || {});
  return (
    <section className="section alt">
      <div className="container">
        <Head s={s} />
        <div className="spec card">
          <table>
            <thead><tr><th>Specification</th>{plans.map((p) => <th key={p.id} className={p.is_popular ? 'pop' : ''}>{p.name}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => <tr key={r}><td>{r}</td>{plans.map((p) => <td key={p.id} className={p.is_popular ? 'pop' : ''}>{p.specs?.[r] ?? '—'}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Payments({ s }) {
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className="pay-row">{(s.data?.items || []).map((x) => <PayBadge key={typeof x === 'string' ? x : x.name} item={x} />)}</div>
      </div>
    </section>
  );
}

function Benchmark({ s }) {
  const d = s.data || {};
  return (
    <section className="section">
      <div className="container split">
        <Reveal>
          <div className="sec-head left">
            {s.eyebrow && <span className="pill soft">{s.eyebrow}</span>}
            <h2><Rich text={s.title} /></h2>
          </div>
          {s.subtitle && <p className="prose">{s.subtitle}</p>}
          {d.paragraph && <p className="prose">{d.paragraph}</p>}
          <div className="mini-stats">{(d.stats || []).map((x) => <div key={x.label}><b>{x.value}</b><span>{x.label}</span></div>)}</div>
        </Reveal>
        <Reveal delay={120}>
          <div className="bench card">
            <div className="bench-head"><div><h4>{d.card_title}</h4><span className="muted">{d.card_sub}</span></div>{d.card_badge && <span className="ok-pill">{d.card_badge}</span>}</div>
            {(d.rows || []).map((r) => <div className="bench-row" key={r.name}><span>{r.name}</span><span><b>{r.ms}</b> <s>{r.old}</s></span></div>)}
            <div className="bench-foot"><span>{d.foot}</span>{d.link && <a href={d.link.to}>{d.link.label}</a>}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
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

function JobList({ s }) {
  const [data, setData] = useState({ jobs: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  useEffect(() => { getJson('/api/jobs').then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  const jobs = data.jobs.filter((j) => (!q || `${j.title} ${j.subtitle || ''}`.toLowerCase().includes(q.toLowerCase())) && (!loc || j.location === loc));
  return (
    <section className="section alt" id="openings">
      <div className="container narrow">
        <Head s={s} />
        <div className="search-card card">
          <label>Search<div className="search"><Icon name="eye" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Junior Software Engineer, Internship…" /></div></label>
          <label>Location<select value={loc} onChange={(e) => setLoc(e.target.value)}><option value="">All Locations</option>{data.locations.map((l) => <option key={l}>{l}</option>)}</select></label>
        </div>
        {loading && <div className="center-row"><span className="spinner" /></div>}
        {jobs.map((j) => (
          <Reveal key={j.id}>
            <div className="job card lift">
              <div>
                <h3><Link to={`/jobs/${j.slug}`}>{j.title}{j.subtitle ? ` – ${j.subtitle}` : ''}</Link></h3>
                <div className="tags">{[j.location, j.employment_type, j.experience_level].filter(Boolean).map((x) => <span key={x}>{x}</span>)}</div>
                {j.summary && <p>{j.summary}</p>}
                <div className="tags"><span className="soft">{timeAgo(j.posted_at)}</span><span className="soft">{j.applicants} applicant{j.applicants === 1 ? '' : 's'}</span>{j.deadline && <span className="soft">Deadline: {fmtDate(j.deadline)}</span>}</div>
              </div>
              <div className="btn-row job-btns">
                <Link to={`/jobs/${j.slug}`} className="btn sm outline">View Details</Link>
                <Link to={`/jobs/${j.slug}?apply=1`} className="btn sm">Apply Now</Link>
              </div>
            </div>
          </Reveal>
        ))}
        {!loading && !jobs.length && <div className="empty card"><h3>No jobs match your search criteria</h3><p className="muted">Try adjusting your filters or keywords.</p></div>}
      </div>
    </section>
  );
}

function PostList({ s }) {
  const kind = s.data?.kind === 'news' ? 'news' : 'blog';
  const [state, setState] = useState({ data: [], meta: { current_page: 1, last_page: 1, total: 0 }, categories: [] });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const p = new URLSearchParams({ type: kind, page });
    if (search) p.set('q', search);
    if (cat) p.set('category', cat);
    getJson(`/api/posts?${p}`).then((d) => alive && setState(d)).catch(() => {}).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [kind, page, search, cat]);

  const go = (e) => { e.preventDefault(); setPage(1); setSearch(q.trim()); };
  const { data, meta, categories } = state;
  return (
    <section className="section">
      <div className="container">
        <Head s={s} />
        <div className="post-tools">
          <form onSubmit={go} className="search-card card slim"><div className="search"><Icon name="eye" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${kind === 'news' ? 'news' : 'articles'}…`} /></div><button className="btn sm">Search</button></form>
          {kind === 'blog' && !!categories.length && (
            <div className="chips">
              <button className={!cat ? 'on' : ''} onClick={() => { setCat(''); setPage(1); }}>All</button>
              {categories.map((c) => <button key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => { setCat(c.slug); setPage(1); }}>{c.name}</button>)}
            </div>
          )}
        </div>
        {loading && !data.length ? <div className="center-row"><span className="spinner" /></div> : (
          <div className="grid cols-3">{data.map((p) => <PostCard key={p.slug} p={p} />)}</div>
        )}
        {!loading && !data.length && <div className="empty card"><h3>No {kind === 'news' ? 'news' : 'articles'} found</h3><p className="muted">Try a different search{kind === 'blog' ? ' or category' : ''}.</p></div>}
        {meta.last_page > 1 && (
          <div className="pager">
            <button disabled={meta.current_page <= 1} onClick={() => { setPage(meta.current_page - 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}>← Previous</button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => <button key={n} className={n === meta.current_page ? 'on' : ''} onClick={() => { setPage(n); window.scrollTo({ top: 300, behavior: 'smooth' }); }}>{n}</button>)}
            <button disabled={meta.current_page >= meta.last_page} onClick={() => { setPage(meta.current_page + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}>Next →</button>
          </div>
        )}
      </div>
    </section>
  );
}

const map = {
  strip: Strip, domain_search: DomainSearch, combo: Combo, pricing_plans: PricingPlans, spec_table: SpecTable, payments: Payments, benchmark: Benchmark,
  article: Article, quotes: Quotes, post_list: PostList, clients: Clients,
  hero: Hero, cards: Cards, services_grid: ServicesGrid, industries_grid: IndustriesGrid, stats: Stats,
  split: Split, showcase: Showcase, steps: Steps, testimonials: Testimonials, faq: Faq, cta: Cta,
  branches: Branches, contact_form: ContactForm, job_list: JobList, jobs: JobList,
};

export default function Section({ section }) {
  const C = map[section.type];
  return C ? <C s={section} /> : null;
}
