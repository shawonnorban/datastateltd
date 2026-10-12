<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{
    public function index()
    {
        return view('admin.applications', [
            'applications' => JobApplication::latest()->paginate(20),
        ]);
    }

    public function cv(JobApplication $application)
    {
        abort_unless(Storage::disk('local')->exists($application->cv_path), 404);

        return Storage::disk('local')->download(
            $application->cv_path,
            $application->cv_original_name ?: basename($application->cv_path)
        );
    }

    public function update(Request $request, JobApplication $application)
    {
        $data = $request->validate(['status' => ['required', 'in:new,reviewed,shortlisted,rejected']]);
        $application->update($data);

        return back()->with('status', 'Status updated.');
    }
}
