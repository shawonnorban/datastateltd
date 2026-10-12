import { createContext, useContext, useEffect, useState } from 'react';
import { site as fallbackSite, solutions as fbSolutions, industries as fbIndustries, branches as fbBranches } from './data.js';

const fallback = {
  site: { ...fallbackSite, logo_url: null, whatsapp: null, address: null, map_embed_url: null, social: {}, branches: fbBranches },
  solutions: fbSolutions,
  industries: fbIndustries,
  testimonials: [],
};

const Ctx = createContext(fallback);
export const useSite = () => useContext(Ctx);

const get = (url) => fetch(url, { headers: { Accept: 'application/json' } }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

export function SiteProvider({ children }) {
  const [state, setState] = useState(fallback);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([get('/api/site'), get('/api/services'), get('/api/industries'), get('/api/testimonials')]).then(
      ([site, services, industries, testimonials]) => {
        if (!alive) return;
        setState((prev) => ({
          site: site.status === 'fulfilled'
            ? {
                ...prev.site,
                ...Object.fromEntries(Object.entries(site.value).filter(([, v]) => v !== null && v !== '')),
                branches: site.value.branches?.length ? site.value.branches : prev.site.branches,
              }
            : prev.site,
          solutions: services.status === 'fulfilled' && services.value.length
            ? services.value.map((s) => ({ title: s.title, text: s.short_description }))
            : prev.solutions,
          industries: industries.status === 'fulfilled' && industries.value.length
            ? industries.value.map((i) => i.name)
            : prev.industries,
          testimonials: testimonials.status === 'fulfilled' ? testimonials.value : prev.testimonials,
        }));
      }
    );
    return () => { alive = false; };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
