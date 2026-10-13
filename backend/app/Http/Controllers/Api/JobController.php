<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobController extends Controller
{
    private function present(Job $j, bool $full = false): array
    {
        $row = [
            'id' => $j->id,
            'slug' => $j->slug,
            'title' => $j->title,
            'subtitle' => $j->subtitle,
            'company' => $j->company,
            'location' => $j->location,
            'employment_type' => $j->employment_type,
            'experience_level' => $j->experience_level,
            'summary' => $j->summary,
            'deadline' => $j->deadline?->toDateString(),
            'posted_at' => $j->created_at?->toIso8601String(),
            'applicants' => $j->applications_count ?? $j->applications()->count(),
            'is_open' => $j->isOpen(),
        ];

        if ($full) {
            $row += ['salary' => $j->salary, 'vacancies' => $j->vacancies, 'sections' => $j->sections ?? []];
        }

        return $row;
    }

    public function index()
    {
        $jobs = Job::withCount('applications')->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('deadline')->orWhere('deadline', '>=', now()->toDateString()))
            ->orderBy('sort_order')->latest()->get();

        return [
            'jobs' => $jobs->map(fn ($j) => $this->present($j)),
            'locations' => $jobs->pluck('location')->filter()->unique()->values(),
        ];
    }

    public function show(string $slug)
    {
        $job = Job::withCount('applications')->where('slug', $slug)->where('is_active', true)->firstOrFail();

        return $this->present($job, true);
    }

    public function apply(Request $request, string $slug)
    {
        $job = Job::where('slug', $slug)->where('is_active', true)->firstOrFail();

        if (! $job->isOpen()) {
            return response()->json(['message' => 'Applications for this position are closed.'], 422);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:30'],
            'cover_note' => ['nullable', 'string', 'max:3000'],
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ], [
            'cv.mimes' => 'Please upload your CV as a PDF file.',
            'cv.max' => 'The CV must not be larger than 5 MB.',
        ]);

        if (JobApplication::where('job_id', $job->id)->where('email', $data['email'])->exists()) {
            return response()->json(['message' => 'You have already applied for this position with this email address.', 'errors' => ['email' => ['You have already applied for this position.']]], 422);
        }

        $file = $request->file('cv');

        JobApplication::create([
            'job_id' => $job->id,
            'position' => $job->title,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'cover_note' => $data['cover_note'] ?? null,
            'cv_path' => $file->store('cvs', 'local'),
            'cv_original_name' => $file->getClientOriginalName(),
        ]);

        return response()->json(['message' => 'Application submitted'], 201);
    }
}
