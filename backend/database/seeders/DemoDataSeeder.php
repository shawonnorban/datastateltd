<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use App\Models\ProjectCategory;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Demo content so the public site looks complete. Never overwrites values
 * an admin has already filled in from the settings page.
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->settings();
        $this->solutions();
        $this->industries();
        $this->testimonials();
    }

    private function settings(): void
    {
        Storage::disk('public')->put('branding/demo-logo.svg', <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 60"><rect width="48" height="48" x="4" y="6" rx="12" fill="#1a5fd0"/><path d="M16 36l8-18 8 18M19 30h10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="62" y="30" font-family="Arial,sans-serif" font-weight="700" font-size="22" fill="#06213f">SMART GLOBAL</text><text x="62" y="50" font-family="Arial,sans-serif" font-weight="600" font-size="16" letter-spacing="6" fill="#1a5fd0">IT</text></svg>
SVG);

        $demo = [
            'site_name' => ['Smart Global IT', 'text', 'general'],
            'tagline' => ['Cloud-based, customizable software designed to grow your business.', 'text', 'general'],
            'logo' => ['branding/demo-logo.svg', 'image', 'general'],
            'contact_phone' => ['+880 1700-000000', 'text', 'contact'],
            'contact_whatsapp' => ['+8801700000000', 'text', 'contact'],
            'contact_email' => ['info@smartglobalit.test', 'text', 'contact'],
            'address' => ['House 12, Road 5, Dhanmondi, Dhaka-1205, Bangladesh', 'textarea', 'contact'],
            'map_embed_url' => ['', 'url', 'contact'],
            'facebook_url' => ['https://facebook.com/', 'url', 'social'],
            'twitter_url' => ['https://x.com/', 'url', 'social'],
            'linkedin_url' => ['https://linkedin.com/', 'url', 'social'],
            'youtube_url' => ['https://youtube.com/', 'url', 'social'],
            'branches' => [json_encode([
                ['name' => 'Head Office', 'address' => 'House 12, Road 5, Dhanmondi, Dhaka-1205, Bangladesh', 'phone' => '+880 1700-000000', 'email' => 'info@smartglobalit.test'],
                ['name' => 'Chittagong', 'address' => 'Agrabad C/A, Chittagong-4100, Bangladesh', 'phone' => '+880 1700-000001', 'email' => 'ctg@smartglobalit.test'],
                ['name' => 'Sylhet', 'address' => 'Zindabazar, Sylhet-3100, Bangladesh', 'phone' => '+880 1700-000002', 'email' => 'sylhet@smartglobalit.test'],
                ['name' => 'Kuala Lumpur', 'address' => 'Jalan Ampang, 50450 Kuala Lumpur, Malaysia', 'phone' => '+60 3-0000 0000', 'email' => 'my@smartglobalit.test'],
            ]), 'json', 'contact'],
        ];

        foreach ($demo as $key => [$value, $type, $group]) {
            $setting = SiteSetting::firstOrNew(['key' => $key]);
            $placeholders = ['hello@example.com', 'Your Vision, Our Technology', 'SMART GLOBAL IT'];
            if (blank($setting->value) || in_array($setting->value, $placeholders, true)) {
                $setting->fill(['value' => $value, 'type' => $type, 'group' => $group])->save();
            }
        }
    }

    private function solutions(): void
    {
        $titles = [
            'Accounts Management', 'Warehouse Management', 'Purchase Management', 'Sales Management',
            'Production Module', 'Damage & Wastage Management', 'HRM Module', 'Import L/C Module',
            'Customer Portal', 'Vendor Portal', 'Fixed Asset Management', 'Vehicle Management',
            'CRM Management', 'Task Module', 'Managerial Module', 'User Module', 'MIS Module',
            'License Management', 'Loan Management', 'POS Management', 'Billing Module', 'KPI Module',
            'Hotel Management', 'Visitor Management', 'E-Procurement',
        ];

        foreach ($titles as $i => $title) {
            Service::firstOrCreate(['slug' => Str::slug($title)], [
                'title' => $title,
                'short_description' => "{$title} helps your team manage daily operations with accurate, real-time data.",
                'is_featured' => $i < 9,
                'is_active' => true,
                'sort_order' => 100 + $i,
            ]);
        }
    }

    private function industries(): void
    {
        $names = [
            'Trading & Distribution', 'Food & Beverage', 'SME Industries', 'FMCG', 'Pharmaceutical',
            'Retail & Wholesale', 'Agro', 'Government', 'University & Institute', 'Hotel & Reservation',
            'Mills & Factories', 'Jute', 'Manufacturing', 'Garments', 'Accessories', 'Real Estate',
            'Power & Energy', 'Electrical',
        ];

        foreach ($names as $i => $name) {
            ProjectCategory::firstOrCreate(['slug' => Str::slug($name)], [
                'name' => $name,
                'description' => "Tailored software for the {$name} sector.",
                'is_active' => true,
                'sort_order' => 100 + $i,
            ]);
        }
    }

    private function testimonials(): void
    {
        $items = [
            ['Rahim Uddin', 'Finance Manager', 'Demo Group', 'The implementation cut our month-end closing cycle significantly. Outstanding support.'],
            ['Nadia Karim', 'Operations Head', 'Sample Foods Ltd.', 'Inventory and purchasing finally live in one place. Our team adopted it within days.'],
            ['Faisal Ahmed', 'Head of IT', 'Example Textiles', 'Reliable, secure and easy to customise for our workflow.'],
        ];

        foreach ($items as $i => [$name, $position, $company, $content]) {
            Testimonial::firstOrCreate(['client_name' => $name], [
                'client_position' => $position,
                'company_name' => $company,
                'rating' => 5,
                'content' => $content,
                'is_featured' => $i === 0,
                'is_active' => true,
                'sort_order' => 10 + $i,
            ]);
        }

        if (Inquiry::count() === 0) {
            Inquiry::create([
                'name' => 'Demo Visitor', 'email' => 'visitor@example.com', 'phone' => '+880 1700-111111',
                'subject' => 'Demo request', 'message' => 'We would like to see a demo.', 'type' => 'contact',
            ]);
        }
    }
}
