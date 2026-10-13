import { useEffect, useState } from 'react';
import Section from '../components/Sections.jsx';
import { useSite } from '../SiteContext.jsx';

function setMeta(description) {
  let el = document.querySelector('meta[name="description"]');
  if (!el) { el = document.createElement('meta'); el.name = 'description'; document.head.appendChild(el); }
  el.content = description || '';
}

export default function DynamicPage({ slug }) {
  const { site } = useSite();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null); setError(false);
    fetch(`/api/pages/${slug}`, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => {
    const name = site.name || '';
    if (data?.page?.title) document.title = name ? `${data.page.title} | ${name}` : data.page.title;
    else if (error) document.title = name ? `Page not found | ${name}` : 'Page not found';
    setMeta(data?.page?.description);
  }, [data, error, site.name]);

  if (error) return <div className="state container">Content is unavailable right now. Please try again shortly.</div>;
  if (!data) return <div className="state container"><span className="spinner" /></div>;
  return data.sections.map((s) => <Section key={s.id} section={s} />);
}
