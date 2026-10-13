<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    private function rules(?Job $job = null): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('jobs_board', 'slug')->ignore($job?->id)],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'string', 'max:80'],
            'experience_level' => ['nullable', 'string', 'max:80'],
            'salary' => ['nullable', 'string', 'max:255'],
            'vacancies' => ['nullable', 'integer', 'min:1'],
            'deadline' => ['nullable', 'date'],
            'summary' => ['nullable', 'string', 'max:2000'],
            'sections' => ['nullable', 'array'],
            'sections.*.title' => ['required', 'string', 'max:255'],
            'sections.*.items' => ['present', 'array'],
            'sections.*.items.*' => ['string', 'max:1000'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }

    private function uniqueSlug(string $base, ?int $ignore = null): string
    {
        $slug = Str::slug($base) ?: 'job';
        $n = 2;
        $candidate = $slug;
        while (Job::where('slug', $candidate)->when($ignore, fn ($q) => $q->where('id', '!=', $ignore))->exists()) {
            $candidate = $slug.'-'.$n++;
        }

        return $candidate;
    }

    public function index()
    {
        return Job::withCount('applications')->orderBy('sort_order')->latest()->get();
    }

    public function show(Job $job)
    {
        return $job;
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $data['slug'] = ($data['slug'] ?? null) ?: $this->uniqueSlug($data['title']);
        $data['sections'] = array_values($data['sections'] ?? []);

        return response(Job::create($data), 201);
    }

    public function update(Request $request, Job $job)
    {
        $data = $request->validate($this->rules($job));
        $data['slug'] = ($data['slug'] ?? null) ?: $job->slug;
        $data['sections'] = array_values($data['sections'] ?? []);
        $job->update($data);

        return $job->fresh();
    }

    public function destroy(Job $job)
    {
        $job->delete();

        return response()->noContent();
    }
}
