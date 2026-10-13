<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DomainTld;
use App\Models\HostingPlan;
use App\Models\Inquiry;
use App\Models\JobApplication;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\ProjectCategory;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Support\MapEmbed;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicController extends Controller
{
    public function site()
    {
        $s = SiteSetting::pluck('value', 'key');

        return [
            'name' => $s['site_name'] ?? null,
            'full_name' => $s['site_full_name'] ?? null,
            'tagline' => $s['tagline'] ?? null,
            'hero_banner_url' => ($s['hero_banner'] ?? null) ? Storage::disk('public')->url($s['hero_banner']) : null,
            'logo_url' => ($s['logo'] ?? null) ? Storage::disk('public')->url($s['logo']) : null,
            'phone' => $s['contact_phone'] ?? null,
            'whatsapp' => $s['contact_whatsapp'] ?? null,
            'email' => $s['contact_email'] ?? null,
            'address' => $s['address'] ?? null,
            // A pasted share link is never embeddable: derive a working URL from it or from the address.
            'map_embed_url' => MapEmbed::isEmbeddable($s['map_embed_url'] ?? null)
                ? $s['map_embed_url']
                : MapEmbed::from(null, ($s['map_embed_url'] ?? '') !== '' ? ($s['address'] ?? null) : null),
            'map_link' => ($s['map_link'] ?? '') !== '' ? $s['map_link'] : (($s['map_embed_url'] ?? '') !== '' && ! MapEmbed::isEmbeddable($s['map_embed_url']) ? $s['map_embed_url'] : null),
            'social' => [
                'facebook' => $s['facebook_url'] ?? null,
                'twitter' => $s['twitter_url'] ?? null,
                'linkedin' => $s['linkedin_url'] ?? null,
                'youtube' => $s['youtube_url'] ?? null,
            ],
            'branches' => json_decode($s['branches'] ?? '[]', true) ?: [],
            'legal' => $this->lines($s['legal_info'] ?? ''),
            'memberships' => collect($this->lines($s['memberships'] ?? ''))
                ->map(fn ($l) => ['name' => trim(Str::before($l, '|')), 'full_name' => trim(Str::contains($l, '|') ? Str::after($l, '|') : '')])
                ->all(),
        ];
    }

    private function lines(string $text): array
    {
        return array_values(array_filter(array_map('trim', preg_split('/\R/', $text))));
    }

    public function page(string $slug)
    {
        $sections = PageSection::where('page', $slug)->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'key', 'type', 'eyebrow', 'title', 'subtitle', 'data']);

        abort_if($sections->isEmpty(), 404);

        $meta = Page::where('slug', $slug)->first(['title', 'meta_title', 'meta_description', 'is_published']);
        abort_if($meta && ! $meta->is_published, 404);

        $sections = $sections->map(function ($section) {
            $data = $section->data ?? [];
            if (! empty($data['image'])) {
                $data['image_url'] = Storage::disk('public')->url($data['image']);
            }
            $section->data = $data;

            return $section;
        });

        return [
            'page' => [
                'title' => $meta?->meta_title ?: $meta?->title,
                'description' => $meta?->meta_description,
            ],
            'sections' => $sections,
        ];
    }

    public function hosting()
    {
        return [
            'plans' => HostingPlan::where('is_active', true)->orderBy('sort_order')->get()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'tagline' => $p->tagline,
                'badge' => $p->badge,
                'discount_label' => $p->discount_label,
                'old_price_yearly' => $p->old_price_yearly,
                'price_monthly' => $p->price_monthly,
                'price_yearly' => $p->price_yearly,
                'price_triennial' => $p->price_triennial,
                'features' => $p->features ?? [],
                'specs' => $p->specs ?? [],
                'order_url' => $p->order_url,
                'is_popular' => $p->is_popular,
            ]),
            'tlds' => DomainTld::where('is_active', true)->orderBy('sort_order')
                ->get(['id', 'extension', 'price', 'old_price']),
        ];
    }

    public function services()
    {
        return Service::where('is_active', true)->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'icon', 'url', 'short_description', 'is_featured']);
    }

    public function industries()
    {
        return ProjectCategory::where('is_active', true)->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'description', 'url']);
    }

    public function testimonials()
    {
        return Testimonial::where('is_active', true)->orderBy('sort_order')
            ->get(['id', 'client_name', 'client_position', 'company_name', 'rating', 'content']);
    }

    public function storeInquiry(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:255'],
            'interest' => ['nullable', 'string', 'max:190'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        Inquiry::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'subject' => $data['interest'] ?? 'Website inquiry',
            'message' => $data['message'] ?? '',
            'type' => 'contact',
        ]);

        return response()->json(['message' => 'Thank you, we will contact you within 24 hours.'], 201);
    }

    public function storeApplication(Request $request)
    {
        $data = $request->validate([
            'position' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:30'],
            'cover_note' => ['nullable', 'string', 'max:3000'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $file = $request->file('cv');

        JobApplication::create([
            'position' => $data['position'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'cover_note' => $data['cover_note'] ?? null,
            'cv_path' => $file->store('cvs', 'local'),
            'cv_original_name' => $file->getClientOriginalName(),
        ]);

        return response()->json(['message' => 'Application received. Thank you!'], 201);
    }
}
