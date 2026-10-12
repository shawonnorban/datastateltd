import { useEffect, useState } from 'react';
import Section from '../components/Sections.jsx';

export default function DynamicPage({ slug }) {
  const [sections, setSections] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setSections(null); setError(false);
    fetch(`/api/pages/${slug}`, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setSections(d))
      .catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [slug]);

  if (error) return <div className="state container">Content is unavailable right now. Please try again shortly.</div>;
  if (!sections) return <div className="state container"><span className="spinner" /></div>;
  return sections.map((s) => <Section key={s.id} section={s} />);
}
