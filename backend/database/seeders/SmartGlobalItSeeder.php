<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\ProjectCategory;
use App\Models\Project;
use App\Models\PostCategory;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class SmartGlobalItSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@smartglobalit.test');
        $adminPassword = env('ADMIN_PASSWORD');

        if (!$adminPassword) {
            throw new \RuntimeException(
                'Set ADMIN_PASSWORD in backend/.env before running this seeder.'
            );
        }

        $admin = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('ADMIN_NAME', 'Site Administrator'),
                'password' => Hash::make($adminPassword),
                'email_verified_at' => now(),
            ]
        );

        $role = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        $admin->assignRole($role);

        $category = ServiceCategory::firstOrCreate(
            ['slug' => 'web-development'],
            [
                'name' => 'Web Development',
                'description' => 'Websites and web applications',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        $services = [
            [
                'title' => 'Web Development',
                'slug' => 'web-development',
                'icon' => 'code',
                'short_description' => 'Modern, responsive business websites and web applications.',
                'description' => 'We build accessible, maintainable websites and web applications tailored to business needs.',
            ],
            [
                'title' => 'Mobile App Development',
                'slug' => 'mobile-app-development',
                'icon' => 'smartphone',
                'short_description' => 'Mobile experiences designed around your customers.',
                'description' => 'Plan, design and develop mobile application experiences for your customers.',
            ],
            [
                'title' => 'Cloud & DevOps',
                'slug' => 'cloud-devops',
                'icon' => 'cloud',
                'short_description' => 'Reliable deployment workflows and cloud infrastructure.',
                'description' => 'Improve deployment consistency, observability and infrastructure reliability.',
            ],
            [
                'title' => 'Database Solutions',
                'slug' => 'database-solutions',
                'icon' => 'database',
                'short_description' => 'Database design, performance and maintenance.',
                'description' => 'Structured data design, query optimization and maintenance for business applications.',
            ],
            [
                'title' => 'Website Maintenance',
                'slug' => 'website-maintenance',
                'icon' => 'settings',
                'short_description' => 'Ongoing updates, monitoring and technical support.',
                'description' => 'Keep your website updated, monitored and maintained.',
            ],
            [
                'title' => 'IT Consulting',
                'slug' => 'it-consulting',
                'icon' => 'lightbulb',
                'short_description' => 'Practical technology planning for growing businesses.',
                'description' => 'Get help evaluating technology choices and planning a maintainable digital roadmap.',
            ],
        ];

        foreach ($services as $index => $data) {
            Service::firstOrCreate(
                ['slug' => $data['slug']],
                $data + [
                    'service_category_id' => $category->id,
                    'is_featured' => $index < 3,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }

        ProjectCategory::firstOrCreate(
            ['slug' => 'web-applications'],
            ['name' => 'Web Applications', 'is_active' => true, 'sort_order' => 1]
        );

        PostCategory::firstOrCreate(
            ['slug' => 'technology'],
            ['name' => 'Technology', 'description' => 'Technology news and insights', 'is_active' => true]
        );

        Page::firstOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About Us',
                'content' => 'We help businesses turn ideas into reliable digital products.',
                'is_published' => true,
                'published_at' => now(),
                'meta_title' => 'About Smart Global IT',
                'meta_description' => 'Learn about our digital solutions and services.',
            ]
        );

        $settings = [
            'site_name' => ['value' => 'SMART GLOBAL IT', 'type' => 'text', 'group' => 'general'],
            'tagline' => ['value' => 'Your Vision, Our Technology', 'type' => 'text', 'group' => 'general'],
            'contact_email' => ['value' => 'hello@example.com', 'type' => 'text', 'group' => 'contact'],
            'contact_phone' => ['value' => '', 'type' => 'text', 'group' => 'contact'],
            'address' => ['value' => '', 'type' => 'textarea', 'group' => 'contact'],
            'facebook_url' => ['value' => '', 'type' => 'url', 'group' => 'social'],
            'linkedin_url' => ['value' => '', 'type' => 'url', 'group' => 'social'],
        ];

        foreach ($settings as $key => $data) {
            SiteSetting::firstOrCreate(['key' => $key], $data);
        }

        Testimonial::firstOrCreate(
            ['client_name' => 'Sample Client'],
            [
                'client_position' => 'Business Owner',
                'company_name' => 'Sample Company',
                'rating' => 5,
                'content' => 'A sample testimonial. Replace this with a real client review before publishing.',
                'is_featured' => false,
                'is_active' => false,
                'sort_order' => 1,
            ]
        );

        TeamMember::firstOrCreate(
            ['slug' => 'sample-team-member'],
            [
                'name' => 'Sample Team Member',
                'designation' => 'Your Designation',
                'bio' => 'Replace this placeholder with a real team profile.',
                'is_active' => false,
                'sort_order' => 1,
            ]
        );
    }
}
