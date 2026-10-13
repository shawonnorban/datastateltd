<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        return JobApplication::with('job:id,title,slug')
            ->when($request->query('job_id'), fn ($q, $id) => $q->where('job_id', $id))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when(trim((string) $request->query('q')), fn ($q, $s) => $q->where(fn ($w) => $w->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")->orWhere('phone', 'like', "%{$s}%")->orWhere('position', 'like', "%{$s}%")))
            ->latest()->get()->map(fn ($a) => $a->makeHidden('cv_path'));
    }

    public function update(Request $request, JobApplication $application)
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,reviewed,shortlisted,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ]);
        $application->update($data);

        return $application->load('job:id,title,slug')->makeHidden('cv_path');
    }

    public function destroy(JobApplication $application)
    {
        if ($application->cv_path) {
            Storage::disk('local')->delete($application->cv_path);
        }
        $application->delete();

        return response()->noContent();
    }

    public function cv(JobApplication $application)
    {
        abort_unless(Storage::disk('local')->exists($application->cv_path), 404);

        return Storage::disk('local')->download($application->cv_path, $application->cv_original_name ?: basename($application->cv_path));
    }

    public function export(Request $request)
    {
        $rows = JobApplication::with('job:id,title')->latest()->get();

        return response()->streamDownload(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['ID', 'Position', 'Name', 'Email', 'Phone', 'Status', 'Cover note', 'Applied at']);
            foreach ($rows as $a) {
                fputcsv($out, [$a->id, $a->position, $a->name, $a->email, $a->phone, $a->status, $a->cover_note, $a->created_at]);
            }
            fclose($out);
        }, 'job-applications.csv', ['Content-Type' => 'text/csv']);
    }
}
