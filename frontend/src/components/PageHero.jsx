import { Link } from 'react-router-dom';

export default function PageHero({ badge, title, sub, crumb }) {
  return (
    <section className="page-hero">
      <div className="container">
        {badge && <span className="badge-pill">{badge}</span>}
        <h1>{title}</h1>
        <div className="crumb"><Link to="/">Home</Link> / <b>{crumb || title}</b></div>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  );
}
