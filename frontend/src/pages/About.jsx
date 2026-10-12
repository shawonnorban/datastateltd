import PageHero from '../components/PageHero.jsx';
import Metrics from '../components/Metrics.jsx';

export default function About() {
  return (
    <>
      <PageHero title="Best Software Company" crumb="About Us" />
      <section className="section">
        <div className="container">
          <div className="grid3 cards-num">
            {['Our Mission & Commitment', 'Our Vision as a Leading Company', 'Our Experience'].map((t, i) => (
              <div className="info-card" key={t}>
                <span className="big-n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>Placeholder text — replace with your company's own mission, vision and track record.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="img-ph">Image</div>
          <div>
            <span className="eyebrow">Best software solution</span>
            <h2 className="upper">We provide the best software solutions for your business</h2>
            <p>Placeholder company description. Replace with real copy about domain knowledge, delivered projects and partnerships.</p>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container split rev">
          <div>
            <span className="eyebrow">Get the best solutions for your business</span>
            <h2>We Are The Best Software Company.</h2>
            <p>Placeholder text describing your products, approach and reputation.</p>
          </div>
          <div className="img-ph">Image</div>
        </div>
      </section>
      <Metrics />
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Trusted security &amp; performance expertise</span>
            <h2 className="upper">What kind of security do we provide?</h2>
            <p>Placeholder text about security practices.</p>
            {[['Database Security', 99], ['Business Innovation', 90]].map(([l, v]) => (
              <div className="bar" key={l}>
                <div className="bar-top"><span>{l}</span><span>{v}%</span></div>
                <div className="bar-track"><div style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="img-ph">Image</div>
        </div>
      </section>
    </>
  );
}
