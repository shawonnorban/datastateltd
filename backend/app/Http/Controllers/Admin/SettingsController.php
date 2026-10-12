<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /** Plain text settings editable from the admin form: key => [type, group]. */
    public const FIELDS = [
        'site_name' => ['text', 'general'],
        'tagline' => ['text', 'general'],
        'contact_phone' => ['text', 'contact'],
        'contact_whatsapp' => ['text', 'contact'],
        'contact_email' => ['text', 'contact'],
        'address' => ['textarea', 'contact'],
        'map_embed_url' => ['url', 'contact'],
        'facebook_url' => ['url', 'social'],
        'twitter_url' => ['url', 'social'],
        'linkedin_url' => ['url', 'social'],
        'youtube_url' => ['url', 'social'],
        'legal_info' => ['textarea', 'legal'],
        'memberships' => ['textarea', 'legal'],
    ];

    public function edit()
    {
        $settings = SiteSetting::pluck('value', 'key');

        return view('admin.settings', [
            's' => $settings,
            'branches' => json_decode($settings['branches'] ?? '[]', true) ?: [],
            'logoUrl' => $settings['logo'] ?? null ? Storage::disk('public')->url($settings['logo']) : null,
        ]);
    }

    public function update(Request $request)
    {
        $rules = [
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'branches' => ['nullable', 'array'],
            'branches.*.name' => ['nullable', 'string', 'max:120'],
            'branches.*.address' => ['nullable', 'string', 'max:500'],
            'branches.*.phone' => ['nullable', 'string', 'max:40'],
            'branches.*.email' => ['nullable', 'email', 'max:190'],
            'contact_email' => ['nullable', 'email', 'max:190'],
        ];
        foreach (self::FIELDS as $key => [$type]) {
            $rules[$key] = $rules[$key] ?? ['nullable', 'string', $type === 'url' ? 'url' : 'max:2000', 'max:2000'];
        }
        $data = $request->validate($rules);

        foreach (self::FIELDS as $key => [$type, $group]) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $data[$key] ?? '', 'type' => $type, 'group' => $group]
            );
        }

        $branches = collect($data['branches'] ?? [])
            ->filter(fn ($b) => filled($b['name'] ?? null))
            ->map(fn ($b) => [
                'name' => $b['name'],
                'address' => $b['address'] ?? '',
                'phone' => $b['phone'] ?? '',
                'email' => $b['email'] ?? '',
            ])->values();
        SiteSetting::updateOrCreate(
            ['key' => 'branches'],
            ['value' => $branches->toJson(), 'type' => 'json', 'group' => 'contact']
        );

        if ($request->hasFile('logo')) {
            $old = SiteSetting::where('key', 'logo')->value('value');
            $path = $request->file('logo')->store('branding', 'public');
            SiteSetting::updateOrCreate(
                ['key' => 'logo'],
                ['value' => $path, 'type' => 'image', 'group' => 'general']
            );
            if ($old && $old !== $path && str_starts_with($old, 'branding/')) {
                Storage::disk('public')->delete($old);
            }
        }

        return redirect()->route('admin.settings.edit')->with('status', 'Settings saved.');
    }
}
