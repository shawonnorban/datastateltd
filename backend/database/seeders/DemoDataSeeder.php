<?php

namespace Database\Seeders;

use App\Models\DomainTld;
use App\Models\HostingPlan;
use App\Models\Membership;
use App\Models\ProjectCategory;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Site settings, solutions, industries and testimonials. Never overwrites
 * values an admin has already filled in from the settings page.
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('seeders/data/site_pages.json')), true, 512, JSON_THROW_ON_ERROR);

        $this->settings($data['branches']);
        $this->solutions($data['services']);
        $this->industries($data['industries']);
        $this->testimonials($data['testimonials']);
        $this->hosting($data['plans'] ?? [], $data['tlds'] ?? []);
        $this->memberships();
    }

    private function settings(array $scrapedBranches): void
    {
        Storage::disk('public')->put('branding/demo-logo.svg', <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 56"><path d="M20 4l16 16-16 16L4 20z" fill="#0a0a0a"/><path d="M20 14l6 6-6 6-6-6z" fill="#fff"/><text x="46" y="38" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="30" fill="#0a0a0a">INSPIRE BD IT</text></svg>
SVG);

        $branches = array_merge([[
            'name' => 'Corporate Head Office',
            'address' => 'House 8/B, Road #1, Gulshan-1, Dhaka-1212, Bangladesh',
            'phone' => '+88 09666707635',
            'email' => 'contact@datastateltd.com',
        ]], array_slice($scrapedBranches, 1));

        $demo = [
            'site_name' => ['Inspire BD IT', 'text', 'general'],
            'site_full_name' => ['Inspire Bangladesh Information Technology', 'text', 'general'],
            'tagline' => ['Cloud-based, fully customizable software designed to enhance your business growth.', 'text', 'general'],
            'logo' => ['branding/demo-logo.svg', 'image', 'general'],
            'contact_phone' => ['+88 09666707635', 'text', 'contact'],
            'contact_whatsapp' => ['', 'text', 'contact'],
            'contact_email' => ['contact@datastateltd.com', 'text', 'contact'],
            'address' => ['House 8/B, Road #1, Gulshan-1, Dhaka-1212, Bangladesh', 'textarea', 'contact'],
            'map_embed_url' => ['', 'url', 'contact'],
            'facebook_url' => ['', 'url', 'social'],
            'twitter_url' => ['', 'url', 'social'],
            'linkedin_url' => ['', 'url', 'social'],
            'youtube_url' => ['', 'url', 'social'],
            'legal_info' => ["Trade License No: 15511 · Address: House-181, Tetuibari, Kashimpur, Gazipur\nVAT Registration No. (BIN): 007430612-0101\nBIDA Registration No: L-202601050018353-H", 'textarea', 'legal'],
            'branches' => [json_encode($branches, JSON_UNESCAPED_UNICODE), 'json', 'contact'],
        ];

        $placeholders = ['hello@example.com', 'Your Vision, Our Technology', 'SMART GLOBAL IT', 'Data State Ltd'];

        foreach ($demo as $key => [$value, $type, $group]) {
            $setting = SiteSetting::firstOrNew(['key' => $key]);
            if (blank($setting->value) || in_array($setting->value, $placeholders, true)) {
                $setting->fill(['value' => $value, 'type' => $type, 'group' => $group])->save();
            }
        }
    }

    private function solutions(array $items): void
    {
        // Sample rows from the base seeder are replaced by the real module list.
        Service::whereIn('slug', [
            'web-development', 'mobile-app-development', 'cloud-devops',
            'database-solutions', 'website-maintenance', 'it-consulting',
        ])->update(['is_active' => false]);

        foreach ($items as $i => $s) {
            Service::whereNull('url')->where('slug', Str::slug($s['title']))->update(['url' => $s['to'] ?? null]);
            Service::firstOrCreate(['slug' => Str::slug($s['title'])], [
                'title' => $s['title'],
                'short_description' => $s['text'],
                'url' => $s['to'] ?? null,
                'is_featured' => $i < 12,
                'is_active' => true,
                'sort_order' => 100 + $i,
            ]);
        }
    }

    private function industries(array $items): void
    {
        ProjectCategory::where('slug', 'web-applications')->update(['is_active' => false]);

        foreach ($items as $i => $c) {
            ProjectCategory::firstOrCreate(['slug' => Str::slug($c['title'])], [
                'name' => $c['title'],
                'description' => $c['text'] ?? null,
                'url' => $c['to'] ?? null,
                'is_active' => true,
                'sort_order' => 100 + $i,
            ]);
        }
    }

    private function testimonials(array $items): void
    {
        foreach ($items as $i => $t) {
            [$position, $company] = array_pad(array_map('trim', explode(',', $t['role'], 2)), 2, null);

            Testimonial::firstOrCreate(['client_name' => $t['name']], [
                'client_position' => $position,
                'company_name' => $company,
                'rating' => $t['rating'] ?? 5,
                'content' => $t['text'],
                'is_featured' => $i < 3,
                'is_active' => true,
                'sort_order' => 10 + $i,
            ]);
        }
    }

    private function hosting(array $plans, array $tlds): void
    {
        foreach ($plans as $i => $p) {
            HostingPlan::firstOrCreate(['name' => $p['name']], [
                'tagline' => $p['tagline'],
                'badge' => $p['badge'] ?? null,
                'discount_label' => $p['discount'] ?? null,
                'old_price_yearly' => $p['old_yearly'] ?? null,
                'price_monthly' => $p['monthly'],
                'price_yearly' => $p['yearly'],
                'price_triennial' => $p['triennial'],
                'features' => $p['features'],
                'specs' => $p['specs'],
                'order_url' => '/company/request-demo',
                'is_popular' => $p['popular'],
                'is_active' => true,
                'sort_order' => ($i + 1) * 10,
            ]);
        }

        foreach ($tlds as $i => [$ext, $price]) {
            DomainTld::firstOrCreate(['extension' => $ext], [
                'price' => $price,
                'is_active' => true,
                'sort_order' => ($i + 1) * 10,
            ]);
        }
    }

    /** Logos are uploaded from the admin panel (Certifications); until then the name is shown as text. */
    private function memberships(): void
    {
        $items = [
            ['BASIS', 'Bangladesh Association of Software & Information Services'],
            ['BIDA', 'Bangladesh Investment Development Authority'],
        ];

        foreach ($items as $i => [$name, $full]) {
            Membership::firstOrCreate(['name' => $name], ['full_name' => $full, 'is_active' => true, 'sort_order' => ($i + 1) * 10]);
        }
    }
}
