<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function index()
    {
        return JobApplication::latest()->get()->map(fn ($a) => $a->makeHidden('cv_path'));
    }

    public function update(Request $request, JobApplication $application)
    {
        $application->update($request->validate(['status' => ['required', 'in:new,reviewed,shortlisted,rejected']]));

        return $application->makeHidden('cv_path');
    }

    public function cv(JobApplication $application)
    {
        abort_unless(Storage::disk('local')->exists($application->cv_path), 404);

        return Storage::disk('local')->download($application->cv_path, $application->cv_original_name ?: basename($application->cv_path));
    }
}
