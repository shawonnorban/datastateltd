import {
  siWordpress, siWoocommerce, siLaravel, siNodedotjs, siPython, siCpanel, siPhpmyadmin, siPrestashop,
  siPhp, siMysql, siMariadb, siRedis, siVisa, siMastercard, siJoomla, siDrupal, siApache, siNginx,
  siReact, siMongodb, siPostgresql, siGit, siDocker, siNextdotjs, siVuedotjs, siSymfony, siCodeigniter,
  siCloudflare, siJavascript, siDjango, siPaypal, siStripe,
} from 'simple-icons';
import Icon from './Icon.jsx';

const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

const REG = {
  wordpress: siWordpress, woocommerce: siWoocommerce, laravel: siLaravel, nodejs: siNodedotjs, node: siNodedotjs,
  python: siPython, cpanel: siCpanel, phpmyadmin: siPhpmyadmin, prestashop: siPrestashop, php: siPhp, mysql: siMysql,
  mariadb: siMariadb, redis: siRedis, visa: siVisa, mastercard: siMastercard, joomla: siJoomla, drupal: siDrupal,
  apache: siApache, nginx: siNginx, react: siReact, mongodb: siMongodb, postgresql: siPostgresql, git: siGit,
  docker: siDocker, nextjs: siNextdotjs, vuejs: siVuedotjs, symfony: siSymfony, codeigniter: siCodeigniter,
  cloudflare: siCloudflare, javascript: siJavascript, django: siDjango, paypal: siPaypal, stripe: siStripe,
};

/** Brand logo for a technology name. Falls back to a generic icon for unknown names. */
export function BrandMark({ name, logo, size = 18 }) {
  if (logo) return <img src={logo} alt="" height={size} style={{ height: size, width: 'auto' }} />;
  const k = key(name);
  if (k === 'litespeed' || k === 'litespeedenterprise') {
    // LiteSpeed has no icon in simple-icons: lightning mark in its blue
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#0a5ea8" />
        <path d="M13.5 3 6 13.2h5L9.8 21 18 10.4h-5.2z" fill="#fff" />
      </svg>
    );
  }
  const TILE = { woocommerce: ['#7f54b3', 'Woo'], cpanel: ['#ff6c2c', 'cP'] };
  if (TILE[k]) {
    // their icon-set artwork is a wide wordmark that is unreadable at icon size: compact tile instead
    return (
      <span className="brand-tile" style={{ background: TILE[k][0], width: size, height: size, fontSize: size * 0.42 }}>{TILE[k][1]}</span>
    );
  }
  const ic = REG[k];
  if (!ic) return <span className="brand-fallback"><Icon name="server" size={size} /></span>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" role="img">
      <path d={ic.path} fill={`#${ic.hex}`} />
    </svg>
  );
}

// Bangladeshi payment brands are not in any icon set: stylised wordmark tiles in each brand colour.
const PAY = {
  bkash: { bg: '#e2136e', fg: '#fff', text: 'bKash', style: { fontStyle: 'italic', fontWeight: 800 } },
  nagad: { bg: '#f6921e', fg: '#fff', text: 'nagad', style: { fontWeight: 800, textTransform: 'lowercase' } },
  rocket: { bg: '#8c3494', fg: '#fff', text: 'Rocket', style: { fontWeight: 800 } },
  upay: { bg: '#fcd116', fg: '#0c3b8f', text: 'upay', style: { fontWeight: 800 } },
};

/** Payment method badge with logo. Items may be plain names or {name, logo}. */
export function PayBadge({ item }) {
  const name = typeof item === 'string' ? item : item.name;
  const logo = typeof item === 'string' ? null : item.logo;
  const k = key(name);

  if (logo) return <span className="pay"><img src={logo} alt={name} /></span>;
  if (PAY[k]) {
    const p = PAY[k];
    return <span className="pay"><span className="pay-tile" style={{ background: p.bg, color: p.fg, ...p.style }}>{p.text}</span><span className="pay-name">{name}</span></span>;
  }
  if (k.includes('visa') || k.includes('card') || k.includes('mastercard')) {
    return (
      <span className="pay">
        <BrandMark name="visa" size={30} /><BrandMark name="mastercard" size={30} />
        <span className="pay-name">{name}</span>
      </span>
    );
  }
  return <span className="pay"><BrandMark name={name} size={26} /><span className="pay-name">{name}</span></span>;
}
