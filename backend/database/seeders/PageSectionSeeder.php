<?php

namespace Database\Seeders;

use App\Models\PageSection;
use Illuminate\Database\Seeder;

/**
 * Public page content. Uses firstOrCreate so edits made in the admin panel
 * are never overwritten when the seeder runs again.
 */
class PageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $order = [];
        foreach ($this->sections() as $page => $list) {
            foreach ($list as $i => [$type, $key, $eyebrow, $title, $subtitle, $data]) {
                PageSection::firstOrCreate(
                    ['key' => "{$page}-{$key}"],
                    [
                        'page' => $page,
                        'type' => $type,
                        'eyebrow' => $eyebrow,
                        'title' => $title,
                        'subtitle' => $subtitle,
                        'data' => $data,
                        'is_active' => true,
                        'sort_order' => ($i + 1) * 10,
                    ]
                );
            }
        }
    }

    private function pillars(): array
    {
        return ['items' => [
            ['icon' => 'target', 'title' => 'Our Mission & Commitment', 'text' => 'To deliver reliable software on time, backed by exceptional service and long-term relationships with every client.'],
            ['icon' => 'eye', 'title' => 'Our Vision as a Leading Company', 'text' => 'We foster a positive work culture where excellence thrives and customer needs shape every solution we build.'],
            ['icon' => 'award', 'title' => 'Our Experience Since 2009', 'text' => 'Hundreds of projects delivered at home and abroad, with a client base that keeps growing year after year.'],
        ], 'numbered' => true];
    }

    private function metrics(): array
    {
        return ['items' => [
            ['icon' => 'layers', 'value' => 73, 'label' => 'Enterprise Solutions'],
            ['icon' => 'briefcase', 'value' => 137, 'label' => 'Business Clients'],
            ['icon' => 'rocket', 'value' => 213, 'label' => 'Projects Delivered'],
            ['icon' => 'globe', 'value' => 32, 'label' => 'International Clients'],
        ]];
    }

    private function process(): array
    {
        return ['items' => [
            ['icon' => 'clipboard', 'title' => 'Project Planning', 'text' => 'We learn about your business, map your workflows and design a clear, detailed requirement plan.'],
            ['icon' => 'users', 'title' => 'Organizing Meetings', 'text' => 'Regular sessions to align scope, timelines and responsibilities so nothing is left to chance.'],
            ['icon' => 'rocket', 'title' => 'Start Building', 'text' => 'Our engineers implement, test and launch your solution, then support you after go-live.'],
        ]];
    }

    private function security(): array
    {
        return [
            'bullets' => ['Role-based access control', 'Encrypted data at rest and in transit', 'Automated backups and audit trails', 'Continuous monitoring and updates'],
            'bars' => [['label' => 'Database Security', 'value' => 99], ['label' => 'System Uptime', 'value' => 98], ['label' => 'Business Innovation', 'value' => 90]],
            'visual' => 'shield',
        ];
    }

    private function cta(string $title = 'Ready to streamline your business?'): array
    {
        return ['cta', 'cta', null, $title, 'Talk to our team and get a free consultation and live demo tailored to your industry.',
            ['buttons' => [['label' => 'Request a Demo', 'to' => '/contact'], ['label' => 'View Solutions', 'to' => '/solutions', 'style' => 'ghost']]]];
    }

    private function sections(): array
    {
        return [
            'home' => [
                ['hero', 'hero', 'Smart Software Solutions', 'Software that powers <em>modern</em> businesses',
                    'Streamline accounting, inventory, sales, HRM and CRM with flexible, cloud-ready software built around the way your company works.',
                    ['variant' => 'main',
                     'buttons' => [['label' => 'Request a Demo', 'to' => '/contact'], ['label' => 'Explore Solutions', 'to' => '/solutions', 'style' => 'ghost']],
                     'stats' => [['value' => '15+', 'label' => 'Years of experience'], ['value' => '200+', 'label' => 'Projects delivered'], ['value' => '30+', 'label' => 'Countries served']],
                     'chips' => ['Accounts', 'Inventory', 'HRM', 'CRM', 'POS', 'MIS']]],
                ['cards', 'pillars', null, null, null, $this->pillars()],
                ['services_grid', 'modules', 'We specialize in building awesome features', 'Software Features And Modules',
                    'Pick the modules you need today and add more as your business grows.', ['limit' => 9, 'more' => ['label' => 'View all solutions', 'to' => '/solutions']]],
                ['split', 'intro', 'Best software solution', 'We provide the best software solutions for your business',
                    'We have deep domain knowledge in manufacturing, banking, textiles, real estate, education and healthcare. Our products are inexpensive, extremely secure and simple enough to use without any specialized training.',
                    ['bullets' => ['Accounts, inventory and POS in one platform', 'Built for non-technical teams', 'Local support, global standards'], 'visual' => 'dashboard',
                     'button' => ['label' => 'Learn more about us', 'to' => '/about']]],
                ['stats', 'metrics', null, 'Our Success Metrics', 'With years of experience delivering industry-specific solutions, here is what we have accomplished.', $this->metrics()],
                ['industries_grid', 'industries', 'Industries', 'Industry-Wise Software Solutions', 'Purpose-built workflows for the sectors we know best.', ['limit' => 12, 'more' => ['label' => 'See all industries', 'to' => '/industries']]],
                ['split', 'security', 'Trusted security & performance expertise', 'What kind of security do we provide?',
                    'Security is built into every layer of our software, so your data and your operations stay protected as you scale.', $this->security() + ['reverse' => true]],
                ['steps', 'process', 'Our procedure', 'Get The Best Software Experience', null, $this->process()],
                ['testimonials', 'testimonials', 'Client voices', 'What Industry Leaders Say', null, null],
                ['faq', 'faq', 'FAQ', 'Frequently Asked Questions', null, ['items' => [
                    ['q' => 'How long does an implementation take?', 'a' => 'Most projects go live within 4 to 12 weeks depending on the number of modules and the amount of data migration.'],
                    ['q' => 'Can the software be customised?', 'a' => 'Yes. Every module is configurable, and we build custom features for workflows that are unique to your business.'],
                    ['q' => 'Do you provide training and support?', 'a' => 'We train your team before launch and provide ongoing support by phone, email and chat.'],
                    ['q' => 'Is my data safe?', 'a' => 'Yes. We use role-based access, encryption, regular backups and audit logs on every deployment.'],
                ]]],
                $this->cta(),
            ],

            'about' => [
                ['hero', 'hero', 'About us', 'Best Software Company', 'A team of engineers and consultants helping businesses run smarter since 2009.', ['variant' => 'page']],
                ['cards', 'pillars', null, null, null, $this->pillars()],
                ['split', 'intro', 'Best software solution', 'We provide the best software solutions for your business',
                    'We strengthen our company by partnering with other businesses and serving the country in a meaningful fashion. Our team has delivered large-scale implementations for groups of companies across the region.',
                    ['bullets' => ['Strong domain knowledge', 'Large-scale implementation experience', 'Joint-venture and partner friendly'], 'visual' => 'network']],
                ['split', 'story', 'Get the best solutions for your business', 'We are the best software company',
                    'From small teams to enterprise groups, we create digital tools that simplify daily operations. Our software is trusted by customers and recognised for reliability, performance and service.',
                    ['bullets' => ['HRM, accounting and inventory management', 'POS and smart ERP systems', 'Garments, retail and wholesale solutions'], 'visual' => 'dashboard', 'reverse' => true]],
                ['stats', 'metrics', null, 'Our Success Metrics', 'Numbers that reflect the trust our clients place in us.', $this->metrics()],
                ['split', 'security', 'Trusted security & performance expertise', 'What kind of security do we provide?', 'Strong access controls, encrypted data and continuous monitoring protect your systems from intrusion.', $this->security()],
                ['steps', 'process', 'Our procedure', 'How We Work', null, $this->process()],
                $this->cta('Let us build your next success story'),
            ],

            'solutions' => [
                ['hero', 'hero', 'Solutions', 'Software Solutions & Modules for Businesses', 'Streamline accounting, inventory, sales, HRM, CRM and business operations with flexible software.',
                    ['variant' => 'page', 'buttons' => [['label' => 'Request a Demo', 'to' => '/contact']]]],
                ['services_grid', 'modules', 'We specialize in building awesome features', 'Features And Modules', null, ['limit' => 0]],
                ['steps', 'process', 'Our procedure', 'Get The Best Software Experience', null, $this->process()],
                $this->cta(),
            ],

            'industries' => [
                ['hero', 'hero', 'Industries', 'Industry-Wise Software Solutions', 'Smart software solutions built to fit your industry, scale and workflow.',
                    ['variant' => 'page', 'buttons' => [['label' => 'Request a Demo', 'to' => '/contact']]]],
                ['industries_grid', 'industries', null, 'Industries We Serve', null, ['limit' => 0]],
                ['stats', 'metrics', null, 'Our Success Metrics', 'With years of experience delivering industry-specific solutions, here is what we have accomplished.', $this->metrics()],
                ['split', 'why', 'Best choice for your business', 'Best Software Solution for Your Business',
                    'Managing disconnected systems slows companies down. Our platform brings accounts, sales, inventory and HR together so every team works from the same real-time data.',
                    ['bullets' => ['Automated business operations', 'Real-time reports and dashboards', 'Scales from 5 to 5,000 users'], 'visual' => 'dashboard',
                     'button' => ['label' => 'Explore solutions', 'to' => '/solutions']]],
                ['steps', 'process', 'Our procedure', 'Our Implementation Process', null, $this->process()],
                ['testimonials', 'testimonials', 'Client voices', 'What Industry Leaders Say', null, null],
                $this->cta(),
            ],

            'contact' => [
                ['hero', 'hero', 'Get in touch', 'Contact Us', 'Explore the latest features, products and services — our team replies within 24 hours.', ['variant' => 'page']],
                ['contact_form', 'form', null, 'We Provide Best Software Solution', 'Tell us about your business and we will recommend the right modules.',
                    ['bullets' => ['Enterprise systems', 'Workforce management', 'Client & supplier relationship strategies', 'Free consultation and live demo'],
                     'options' => ['Request a demo', 'Pricing', 'Support', 'Custom software', 'Other']]],
                ['branches', 'branches', 'Locations', 'Our Branches In Bangladesh And Abroad', 'Find our office locations.', null],
            ],

            'careers' => [
                ['hero', 'hero', "We're hiring!", 'Build Your Future <em>With Us</em>', 'Join our team of innovators and help shape the future of business software.',
                    ['variant' => 'page', 'buttons' => [['label' => 'View Openings', 'to' => '#openings']],
                     'stats' => [['value' => '10+', 'label' => 'Open positions'], ['value' => '50+', 'label' => 'Team members'], ['value' => '100+', 'label' => 'Global clients']]]],
                ['cards', 'perks', null, 'Why Join Us?', 'Work on real-world solutions and grow your career.', ['items' => [
                    ['icon' => 'book', 'title' => 'Mentorship & Training', 'text' => 'Learn from experienced professionals with hands-on training.'],
                    ['icon' => 'trending', 'title' => 'Career Growth', 'text' => 'A clear path for advancement and skill development.'],
                    ['icon' => 'globe', 'title' => 'Global Impact', 'text' => 'Build software used by businesses worldwide.'],
                    ['icon' => 'users', 'title' => 'Supportive Team', 'text' => 'A collaborative environment where your ideas are valued.'],
                ], 'columns' => 4]],
                ['jobs', 'jobs', 'Open positions', 'Find Your Perfect Role', 'Browse our open positions for engineers and interns.', ['items' => [
                    ['title' => 'Junior Software Engineer (Internship)', 'location' => 'Remote', 'type' => 'Internship', 'level' => 'Entry level', 'text' => 'Gain hands-on experience in software development, implementation and maintenance on real projects.'],
                    ['title' => 'Junior Software Engineer (Full-time)', 'location' => 'Hybrid', 'type' => 'Full-time', 'level' => 'Entry level', 'text' => 'Work with modern technologies, ship features and grow your career with a supportive team.'],
                    ['title' => 'Business Analyst', 'location' => 'On-site', 'type' => 'Full-time', 'level' => 'Mid level', 'text' => 'Translate client needs into clear requirements and guide implementations from kickoff to go-live.'],
                ]]],
                $this->cta('Do not see your role?'),
            ],
        ];
    }
}
