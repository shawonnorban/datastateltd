<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        return PageSection::orderBy('page')->orderBy('sort_order')
            ->get(['id', 'page', 'key', 'type', 'title', 'is_active', 'sort_order']);
    }

    public function show(PageSection $section)
    {
        return $this->present($section);
    }

    public function update(Request $request, PageSection $section)
    {
        $data = $request->validate([
            'eyebrow' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:500'],
            'subtitle' => ['nullable', 'string', 'max:2000'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'data' => ['nullable', 'string', 'max:100000'],
            'image' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
        ]);

        $json = [];
        if (filled($data['data'] ?? null)) {
            $json = json_decode($data['data'], true);
            if (json_last_error() !== JSON_ERROR_NONE || ! is_array($json)) {
                return response()->json(['message' => 'Content JSON is invalid.', 'errors' => ['data' => ['Content JSON is invalid: '.json_last_error_msg()]]], 422);
            }
        }

        $existing = $section->data['image'] ?? null;
        unset($json['image_url']);
        if ($existing && ! array_key_exists('image', $json)) {
            $json['image'] = $existing;
        }
        if ($request->boolean('remove_image') && ! empty($json['image'])) {
            Storage::disk('public')->delete($json['image']);
            unset($json['image']);
        }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sections', 'public');
            if (! empty($json['image']) && $json['image'] !== $path) {
                Storage::disk('public')->delete($json['image']);
            }
            $json['image'] = $path;
        }

        $section->update([
            'eyebrow' => $data['eyebrow'] ?? null,
            'title' => $data['title'] ?? null,
            'subtitle' => $data['subtitle'] ?? null,
            'sort_order' => $data['sort_order'],
            'is_active' => $data['is_active'],
            'data' => $json ?: null,
        ]);

        return $this->present($section->fresh());
    }

    private function present(PageSection $s): array
    {
        $data = $s->data ?? [];

        return [
            'id' => $s->id, 'page' => $s->page, 'key' => $s->key, 'type' => $s->type,
            'eyebrow' => $s->eyebrow, 'title' => $s->title, 'subtitle' => $s->subtitle,
            'is_active' => $s->is_active, 'sort_order' => $s->sort_order,
            'data' => $data,
            'image_url' => ! empty($data['image']) ? Storage::disk('public')->url($data['image']) : null,
        ];
    }
}
