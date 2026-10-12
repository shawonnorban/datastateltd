<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\PageSection;
use App\Models\ProjectCategory;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicController extends Controller
{
    public function site()
    {
        $s = SiteSetting::pluck('value', 'key');

        return [
            'name' => $s['site_name'] ?? null,
            'tagline' => $s['tagline'] ?? null,
            'logo_url' => ($s['logo'] ?? null) ? Storage::disk('public')->url($s['logo']) : null,
            'phone' => $s['contact_phone'] ?? null,
            'whatsapp' => $s['contact_whatsapp'] ?? null,
            'email' => $s['contact_email'] ?? null,
            'address' => $s['address'] ?? null,
            'map_embed_url' => $s['map_embed_url'] ?? null,
            'social' => [
                'facebook' => $s['facebook_url'] ?? null,
                'twitter' => $s['twitter_url'] ?? null,
                'linkedin' => $s['linkedin_url'] ?? null,
                'youtube' => $s['youtube_url'] ?? null,
            ],
            'branches' => json_decode($s['branches'] ?? '[]', true) ?: [],
        ];
    }

    public function page(string $slug)
    {
        $sections = PageSection::where('page', $slug)->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'key', 'type', 'eyebrow', 'title', 'subtitle', 'data']);

        abort_if($sections->isEmpty(), 404);

        return $sections;
    }

    public function services()
    {
        return Service::where('is_active', true)->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'icon', 'short_description', 'is_featured']);
    }

    public function industries()
    {
        return ProjectCategory::where('is_active', true)->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'description']);
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
}
