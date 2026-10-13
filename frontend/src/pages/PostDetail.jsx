import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useSite } from '../SiteContext.jsx';
import { fmtDate, getJson, renderMarkdown, setPageMeta } from '../lib.js';

export function PostCard({ p }) {
  const base = p.type === 'news' ? '/news' : '/blogs';
  return (
    <Link to={`${base}/${p.slug}`} className="card post lift">
      {p.image_url && <img className="post-img" src={p.image_url} alt="" loading="lazy" />}
      <div className="post-body">
        {p.category && <span className="tag">{p.category}</span>}
        <h3>{p.title}</h3>
        {p.excerpt && <p>{p.excerpt}</p>}
        <div className="post-meta">{[fmtDate(p.published_at), p.type === 'blog' ? `${p.read_minutes} min read` : null].filter(Boolean).join(' · ')}</div>
        <span className="more">Read more <Icon name="arrow" size={15} /></span>
      </div>
    </Link>
  );
}

export default function PostDetail({ type, slug }) {
  const { site } = useSite();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const base = type === 'news' ? '/news' : '/blogs';

  useEffect(() => {
    let alive = true;
    setPost(null); setError(false);
    getJson(`/api/posts/${type === 'news' ? 'news' : 'blog'}/${slug}`).then((p) => alive && setPost(p)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [type, slug]);

  useEffect(() => {
    if (post) setPageMeta(post.meta_title || post.title, post.meta_description, site.name);
    else if (error) setPageMeta('Article not found', '', site.name);
  }, [post, error, site.name]);

  const html = useMemo(() => renderMarkdown(post?.content), [post?.content]);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); };

  if (error) return <div className="state container"><div><h2>Article not found</h2><p className="muted">It may have been moved or unpublished.</p><Link to={base} className="btn">Back to {type === 'news' ? 'news' : 'blog'}</Link></div></div>;
  if (!post) return <div className="state container"><span className="spinner" /></div>;

  const enc = encodeURIComponent;
  return (
    <>
      <section className="hero hero-page post-hero">
        <div className="blob b1" /><div className="blob b2" /><div className="grid-bg" />
        <div className="container hero-in">
          <div className="hero-copy">
            <div className="crumbs"><Link to="/">Home</Link> / <Link to={base}>{type === 'news' ? 'News' : 'Blog'}</Link></div>
            {post.category && <span className="pill">{post.category}</span>}
            <h1>{post.title}</h1>
            <p className="hero-sub post-meta-hero">{[fmtDate(post.published_at), type === 'blog' ? `${post.read_minutes} min read` : null, `${post.views} views`].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container post-layout">
          <article className="post-article">
            {post.excerpt && <p className="post-lead">{post.excerpt}</p>}
            <div className="md" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="share">
              <b>Share</b>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noreferrer">Facebook</a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(post.title)}`} target="_blank" rel="noreferrer">X</a>
              <button onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
            </div>
            <Link to={base} className="back-link"><Icon name="arrow" size={15} /> Back to all {type === 'news' ? 'news' : 'articles'}</Link>
          </article>
          {!!post.related?.length && (
            <aside className="post-side">
              <h3>More to read</h3>
              {post.related.map((r) => (
                <Link key={r.slug} to={`${base}/${r.slug}`} className="related card lift">
                  <b>{r.title}</b><span className="muted">{fmtDate(r.published_at)}</span>
                </Link>
              ))}
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
