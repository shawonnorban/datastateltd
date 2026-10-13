<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\MapEmbed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /** key => [type, group] */
    public const FIELDS = [
        'site_name' => ['text', 'general'],
        'site_full_name' => ['text', 'general'],
        'tagline' => ['text', 'general'],
        'contact_phone' => ['text', 'contact'],
        'contact_whatsapp' => ['text', 'contact'],
        'contact_email' => ['text', 'contact'],
        'address' => ['textarea', 'contact'],
        'map_embed_url' => ['url', 'contact'],
        'map_link' => ['url', 'contact'],
        'facebook_url' => ['url', 'social'],
        'twitter_url' => ['url', 'social'],
        'linkedin_url' => ['url', 'social'],
        'youtube_url' => ['url', 'social'],
        'legal_info' => ['textarea', 'legal'],
        'memberships' => ['textarea', 'legal'],
    ];

    public function show()
    {
        $s = SiteSetting::pluck('value', 'key');
        $values = [];
        foreach (array_keys(self::FIELDS) as $key) {
            $values[$key] = $s[$key] ?? '';
        }
        // The form shows what the admin pasted; the embed URL is derived from it.
        $values['map_embed_url'] = ($s['map_link'] ?? '') !== '' ? $s['map_link'] : ($s['map_embed_url'] ?? '');

        return [
            'values' => $values,
            'branches' => json_decode($s['branches'] ?? '[]', true) ?: [],
            'logo_url' => ($s['logo'] ?? null) ? Storage::disk('public')->url($s['logo']) : null,
            'banner_url' => ($s['hero_banner'] ?? null) ? Storage::disk('public')->url($s['hero_banner']) : null,
        ];
    }

    public function update(Request $request)
    {
        $rules = [
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'hero_banner' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_hero_banner' => ['nullable', 'boolean'],
            'branches' => ['nullable', 'array'],
            'branches.*.name' => ['nullable', 'string', 'max:120'],
            'branches.*.address' => ['nullable', 'string', 'max:500'],
            'branches.*.phone' => ['nullable', 'string', 'max:80'],
            'branches.*.email' => ['nullable', 'string', 'max:190'],
            'contact_email' => ['nullable', 'email', 'max:190'],
        ];
        foreach (self::FIELDS as $key => [$type]) {
            $rules[$key] ??= ['nullable', 'string', $type === 'url' ? 'url' : 'max:2000', 'max:2000'];
        }
        $data = $request->validate($rules);

        foreach (self::FIELDS as $key => [$type, $group]) {
            if (! $request->exists($key) || in_array($key, ['map_embed_url', 'map_link'], true)) {
                continue;
            }
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $data[$key] ?? '', 'type' => $type, 'group' => $group]);
        }

        if ($request->exists('branches')) {
            $branches = collect($data['branches'] ?? [])
                ->filter(fn ($b) => filled($b['name'] ?? null))
                ->map(fn ($b) => [
                    'name' => $b['name'],
                    'address' => $b['address'] ?? '',
                    'phone' => $b['phone'] ?? '',
                    'email' => $b['email'] ?? '',
                ])->values();
            SiteSetting::updateOrCreate(['key' => 'branches'], ['value' => $branches->toJson(), 'type' => 'json', 'group' => 'contact']);
        }

        if ($request->exists('map_embed_url') || $request->exists('map_link')) {
            $link = trim((string) ($data['map_link'] ?? $data['map_embed_url'] ?? ''));
            $address = $data['address'] ?? SiteSetting::where('key', 'address')->value('value');
            SiteSetting::updateOrCreate(['key' => 'map_link'], ['value' => $link, 'type' => 'url', 'group' => 'contact']);
            SiteSetting::updateOrCreate(
                ['key' => 'map_embed_url'],
                ['value' => $link === '' ? '' : (MapEmbed::from($link, $address) ?? ''), 'type' => 'url', 'group' => 'contact']
            );
        }

        $this->replaceImage($request, 'logo', 'logo');
        $this->replaceImage($request, 'hero_banner', 'hero_banner');

        if ($request->boolean('remove_hero_banner')) {
            $old = SiteSetting::where('key', 'hero_banner')->value('value');
            if ($old) {
                Storage::disk('public')->delete($old);
            }
            SiteSetting::where('key', 'hero_banner')->update(['value' => '']);
        }

        return $this->show();
    }

    private function replaceImage(Request $request, string $field, string $key): void
    {
        if (! $request->hasFile($field)) {
            return;
        }
        $old = SiteSetting::where('key', $key)->value('value');
        $path = $request->file($field)->store('branding', 'public');
        SiteSetting::updateOrCreate(['key' => $key], ['value' => $path, 'type' => 'image', 'group' => 'general']);
        if ($old && $old !== $path && str_starts_with($old, 'branding/')) {
            Storage::disk('public')->delete($old);
        }
    }
}
