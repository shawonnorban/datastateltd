import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import ApplyModal from '../components/ApplyModal.jsx';
import { useSite } from '../SiteContext.jsx';
import { fmtDate, getJson, setPageMeta, timeAgo } from '../lib.js';

export default function JobDetail({ slug }) {
  const { site } = useSite();
  const [sp] = useSearchParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(false);
  const [apply, setApply] = useState(false);

  useEffect(() => {
    let alive = true;
    setJob(null); setError(false);
    getJson(`/api/jobs/${slug}`).then((j) => { if (alive) { setJob(j); if (sp.get('apply') && j.is_open) setApply(true); } }).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (job) setPageMeta(`${job.title}${job.subtitle ? ` – ${job.subtitle}` : ''}`, job.summary, site.name);
    else if (error) setPageMeta('Job not found', '', site.name);
  }, [job, error, site.name]);

  if (error) return <div className="state container"><div><h2>Job not found</h2><p className="muted">This position may have been filled or removed.</p><Link to="/jobs" className="btn">See all openings</Link></div></div>;
  if (!job) return <div className="state container"><span className="spinner" /></div>;

  const facts = [
    ['Company', job.company], ['Location', job.location], ['Deadline', job.deadline ? fmtDate(job.deadline) : null],
    ['Type', job.employment_type], ['Level', job.experience_level], ['Salary', job.salary], ['Vacancies', job.vacancies],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="hero hero-page job-hero">
        <div className="blob b1" /><div className="blob b2" /><div className="grid-bg" />
        <div className="container hero-in">
          <div className="hero-copy">
            <div className="crumbs"><Link to="/">Home</Link> / <Link to="/jobs">Careers</Link> / <span>{job.title}</span></div>
            <span className="pill">{job.is_open ? "We're hiring" : 'Applications closed'}</span>
            <h1>{job.title}</h1>
            {job.subtitle && <p className="hero-sub">{job.subtitle}</p>}
            <div className="btn-row">
              {job.is_open ? <button className="btn" onClick={() => setApply(true)}>Apply Now <Icon name="arrow" size={16} /></button> : <span className="btn ghost disabled">Applications closed</span>}
              <Link to="/jobs" className="btn ghost">All openings</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container job-layout">
          <div className="job-main">
            {job.summary && <div className="job-lead card">{job.summary}</div>}
            {job.sections.map((s) => (
              <div className="job-block" key={s.title}>
                <h2>{s.title}</h2>
                <ul className="checks">{s.items.map((it) => <li key={it}><span><Icon name="check" size={14} /></span>{it}</li>)}</ul>
              </div>
            ))}
            <div className="job-apply card">
              <div><h3>{job.is_open ? 'Interested in this role?' : 'This position is closed'}</h3><p className="muted">{job.is_open ? 'Send your CV and we will contact you if you are shortlisted.' : 'Check our other open positions.'}</p></div>
              {job.is_open ? <button className="btn" onClick={() => setApply(true)}>Apply Now</button> : <Link to="/jobs" className="btn">See openings</Link>}
            </div>
          </div>
          <aside className="job-side card">
            <h3>Job overview</h3>
            <dl>{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}<div><dt>Applicants</dt><dd>{job.applicants}</dd></div><div><dt>Posted</dt><dd>{timeAgo(job.posted_at).replace('Posted ', '')}</dd></div></dl>
            {job.is_open && <button className="btn block" onClick={() => setApply(true)}>Apply Now</button>}
          </aside>
        </div>
      </section>
      {apply && <ApplyModal job={job} onClose={() => setApply(false)} />}
    </>
  );
}
