<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SectionController extends Controller
{
    public function index()
    {
        return view('admin.sections.index', [
            'pages' => PageSection::orderBy('page')->orderBy('sort_order')->get()->groupBy('page'),
        ]);
    }

    public function edit(PageSection $section)
    {
        return view('admin.sections.edit', ['section' => $section]);
    }

    public function update(Request $request, PageSection $section)
    {
        $data = $request->validate([
            'eyebrow' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:500'],
            'subtitle' => ['nullable', 'string', 'max:2000'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'data' => ['nullable', 'string', 'max:50000'],
            'image' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
        ]);

        $json = null;
        if (filled($data['data'] ?? null)) {
            $json = json_decode($data['data'], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return back()->withInput()->withErrors(['data' => 'Content JSON is invalid: '.json_last_error_msg()]);
            }
        }

        $json = $json ?? [];
        $existing = $section->data['image'] ?? null;
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
            'is_active' => $request->boolean('is_active'),
            'data' => $json ?: null,
        ]);

        return redirect()->route('admin.sections.edit', $section)->with('status', 'Section saved.');
    }
}
