import { process } from '../data.js';

export default function Process({ title = 'Our Implementation Process' }) {
  return (
    <section className="section">
      <div className="container center">
        <span className="eyebrow">Our Procedure</span>
        <h2>{title}</h2>
        <div className="grid3">
          {process.map((p, i) => (
            <div className={`step step-${i}`} key={p.n}>
              <div className="step-n">{p.n}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
