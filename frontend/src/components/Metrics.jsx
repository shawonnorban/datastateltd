import { metrics } from '../data.js';

export default function Metrics() {
  return (
    <section className="section alt">
      <div className="container center">
        <h2>Our Success Metrics</h2>
        <p className="sub">With years of experience delivering industry-specific solutions, here is what we have accomplished.</p>
        <div className="grid4">
          {metrics.map((m) => (
            <div className="metric" key={m.label}>
              <div className="num">{m.n}</div>
              <div className="lbl">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
