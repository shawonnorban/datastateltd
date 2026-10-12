// Placeholder content. Replace with API data (Laravel backend) later.
export const site = {
  name: 'Smart Global IT',
  phone: '+880 1XXX-XXXXXX',
  email: 'info@smartglobalit.test',
  tagline: 'Cloud-based, customizable software designed to grow your business.',
};

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/industries', label: 'Industries' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/about', label: 'About' },
  { to: '/careers', label: 'Career' },
  { to: '/contact', label: 'Contact Us' },
];

export const solutions = [
  'Accounts Management', 'Warehouse Management', 'Purchase Management', 'Sales Management',
  'Production Module', 'Damage & Wastage Management', 'HRM Module', 'Import L/C Module',
  'Customer Portal', 'Vendor Portal', 'Fixed Asset Management', 'Vehicle Management',
  'CRM Management', 'Task Module', 'Managerial Module', 'User Module', 'MIS Module',
  'License Management', 'Loan Management', 'POS Management', 'Billing Module', 'KPI Module',
  'Hotel Management', 'Visitor Management', 'E-Procurement',
].map((title) => ({
  title,
  text: `${title} helps your team manage daily operations with accurate, real-time data.`,
}));

export const industries = [
  'Trading & Distribution', 'Food & Beverage', 'SME Industries', 'FMCG', 'Pharmaceutical',
  'Retail & Wholesale', 'Agro', 'Government', 'University & Institute', 'Hotel & Reservation',
  'Mills & Factories', 'Jute', 'Manufacturing', 'Garments', 'Accessories', 'Real Estate',
  'Power & Energy', 'Electrical',
];

export const metrics = [
  { n: 73, label: 'Enterprise Solutions' },
  { n: 137, label: 'Business Clients' },
  { n: 213, label: 'Business Projects' },
  { n: 32, label: 'International Clients' },
];

export const process = [
  { n: '01', title: 'Project Planning', text: 'We learn about your needs and design a detailed requirement plan.' },
  { n: '02', title: 'Organizing Meetings', text: 'We schedule meetings to clarify scope, timelines and responsibilities.' },
  { n: '03', title: 'Start Building', text: 'Our team implements, tests and delivers your solution on schedule.' },
];

export const branches = [
  { name: 'Head Office', address: 'Address line, City, Country', phone: '+880 1XXX-XXXXXX', email: 'info@smartglobalit.test' },
  { name: 'Branch Office', address: 'Address line, City, Country', phone: '+880 1XXX-XXXXXX', email: 'info@smartglobalit.test' },
  { name: 'Overseas Office', address: 'Address line, City, Country', phone: '+000 XXX-XXXXXX', email: 'info@smartglobalit.test' },
];

export const perks = [
  { title: 'Mentorship & Training', text: 'Learn from experienced professionals with hands-on training.' },
  { title: 'Career Growth', text: 'Clear path for advancement and skill development.' },
  { title: 'Global Impact', text: 'Work on solutions used by businesses worldwide.' },
  { title: 'Supportive Team', text: 'A collaborative environment where your ideas are valued.' },
];

export const jobs = [
  { id: 1, title: 'Junior Software Engineer (Internship)', location: 'Remote', type: 'Internship', level: 'Entry Level', text: 'Hands-on experience in development, implementation and maintenance.' },
  { id: 2, title: 'Junior Software Engineer (Full-time)', location: 'Hybrid', type: 'Full-time', level: 'Entry Level', text: 'Work on modern technologies and grow your career with us.' },
];

export const footerCols = {
  Solutions: ['Accounts Module', 'Sales Module', 'Warehouse & Store', 'Human Resource', 'Purchase Module', 'CRM', 'All Solutions'],
  Industries: ['Real Estate', 'Food & Beverage', 'Garments', 'Power & Energy', 'Agro', 'Mills & Factories', 'All Industries'],
  Company: ['Home', 'About Us', 'Our Clients', 'Our Team', 'Locations', 'FAQ', 'Privacy Policy'],
};
