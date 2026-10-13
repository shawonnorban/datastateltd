import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

/** Job application form with PDF CV upload. */
export default function ApplyModal({ job, onClose }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = ''; };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const cv = form.cv.files[0];
    if (cv && cv.size > 5 * 1024 * 1024) { setError('The CV must not be larger than 5 MB.'); return; }
    if (cv && cv.type !== 'application/pdf' && !/\.pdf$/i.test(cv.name)) { setError('Please upload your CV as a PDF file.'); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch(`/api/jobs/${job.slug}/apply`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (res.status === 422) {
        const j = await res.json();
        setError(Object.values(j.errors || {})[0]?.[0] || j.message || 'Please check the form.');
        setState('idle'); return;
      }
      if (res.status === 429) { setError('Too many attempts. Please try again in a minute.'); setState('idle'); return; }
      if (!res.ok) throw new Error();
      setState('sent');
    } catch { setError('Could not submit your application. Please try again.'); setState('idle'); }
  };

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close">×</button>
        {state === 'sent' ? (
          <div className="sent">
            <div className="ico grad"><Icon name="check" /></div>
            <h3>Application Submitted!</h3>
            <p>Thank you! Your application for the <b>{job.title}</b> position has been submitted successfully.</p>
            <p className="muted">We will review your application and contact you if you&apos;re shortlisted.</p>
            <button className="btn sm" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Apply now</span>
            <h3>Apply for {job.title}</h3>
            <form className="form" onSubmit={submit}>
              <label>Full Name *<input name="name" required placeholder="Your full name" /></label>
              <label>Email Address *<input name="email" type="email" required placeholder="you@example.com" /></label>
              <label>Phone Number *<input name="phone" required placeholder="+8801XXXXXXXXX" /></label>
              <label>Upload Your CV (PDF only, max 5MB) *
                <input name="cv" type="file" required accept=".pdf,application/pdf" />
                <small className="muted">Include any academic projects or personal work in your CV</small>
              </label>
              <label>Cover note (optional)<textarea name="cover_note" rows="3" placeholder="Tell us briefly about yourself" /></label>
              <p className="muted tiny">Your information will be submitted securely over an encrypted connection.</p>
              {error && <p className="err">{error}</p>}
              <button className="btn block" disabled={state === 'sending'}>{state === 'sending' ? 'Submitting…' : 'Submit Application'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
