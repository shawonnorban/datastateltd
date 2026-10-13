import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true });

/** Markdown from the admin panel -> sanitised HTML. */
export const renderMarkdown = (md) => DOMPurify.sanitize(marked.parse(md || ''), { ADD_ATTR: ['target'] });

export function timeAgo(iso) {
  if (!iso) return '';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  if (days < 30) return `Posted ${days} days ago`;
  const m = Math.floor(days / 30);
  return `Posted ${m} month${m > 1 ? 's' : ''} ago`;
}

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

/** Fetch JSON; rejects with the HTTP status on failure. */
export const getJson = (url) => fetch(url, { headers: { Accept: 'application/json' } }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

export function setPageMeta(title, description, siteName) {
  if (title) document.title = siteName ? `${title} | ${siteName}` : title;
  let el = document.querySelector('meta[name="description"]');
  if (!el) { el = document.createElement('meta'); el.name = 'description'; document.head.appendChild(el); }
  el.content = description || '';
}
