// Placeholder content. Replace with API data (Laravel backend) later.
export const site = {
  name: 'Sarkar IT Firm',
  phone: '+880 1XXX-XXXXXX',
  email: 'info@sarkaritfirm.com',
  tagline: 'Cloud-based, customizable software designed to grow your business.',
};

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/industry', label: 'Industries' },
  { to: '/solution', label: 'Solutions' },
  { to: '/company/clients', label: 'Client List' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/jobs', label: 'Career' },
  { to: '/company/contact', label: 'Contact Us' },
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
  { name: 'Head Office', address: 'Address line, City, Country', phone: '+880 1XXX-XXXXXX', email: 'info@sarkaritfirm.com' },
  { name: 'Branch Office', address: 'Address line, City, Country', phone: '+880 1XXX-XXXXXX', email: 'info@sarkaritfirm.com' },
  { name: 'Overseas Office', address: 'Address line, City, Country', phone: '+000 XXX-XXXXXX', email: 'info@sarkaritfirm.com' },
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
  Solutions: [
    ['Accounts Module', '/solution/accounting-software-in-bangladesh'], ['Sales Module', '/solution/sales-software'],
    ['e-Procurement Module', '/solution/e-procurement-software'], ['Warehouse & Store Module', '/solution/inventory-software'],
    ['Human Resource Management', '/solution/hrm-software'], ['Purchase Module', '/solution/purchase-software'],
    ['Customer Relation Management', '/solution/customer-relationship-management-software'], ['All Solutions', '/solution'],
  ],
  Industries: [
    ['Real Estate', '/industry/real-estate'], ['Food & Beverage', '/industry/food-and-beverage'], ['Garments', '/industry/garments'],
    ['Power & Energy', '/industry/power-and-energy'], ['Agro', '/industry/agro'], ['Mills & Factories', '/industry/mills-and-factories'],
    ['Government', '/industry/government'], ['All Industries', '/industry'],
  ],
  'About Us': [
    ['Home', '/'], ['Blog', '/blogs'], ['News', '/news'], ['About Us', '/company/about'], ['Our Clients', '/company/clients'],
    ['Our Team', '/company/team'], ['Why Choose Us?', '/company/why-erp-com-bd'], ['Locations', '/company/contact'],
    ['FAQ', '/company/faq'], ['Privacy Policy', '/company/privacy-policy'],
  ],
};
