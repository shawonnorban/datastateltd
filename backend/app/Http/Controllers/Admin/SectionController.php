<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\Request;

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
        ]);

        $json = null;
        if (filled($data['data'] ?? null)) {
            $json = json_decode($data['data'], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return back()->withInput()->withErrors(['data' => 'Content JSON is invalid: '.json_last_error_msg()]);
            }
        }

        $section->update([
            'eyebrow' => $data['eyebrow'] ?? null,
            'title' => $data['title'] ?? null,
            'subtitle' => $data['subtitle'] ?? null,
            'sort_order' => $data['sort_order'],
            'is_active' => $request->boolean('is_active'),
            'data' => $json,
        ]);

        return redirect()->route('admin.sections.edit', $section)->with('status', 'Section saved.');
    }
}
