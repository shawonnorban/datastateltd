<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DomainTld;
use App\Models\HostingPlan;
use App\Models\Inquiry;
use App\Models\JobApplication;
use App\Models\PageSection;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return [
            'stats' => [
                'new_inquiries' => Inquiry::where('status', 'new')->count(),
                'inquiries' => Inquiry::count(),
                'new_applications' => JobApplication::where('status', 'new')->count(),
                'applications' => JobApplication::count(),
                'sections' => PageSection::count(),
                'plans' => HostingPlan::count(),
                'tlds' => DomainTld::count(),
            ],
            'recent_inquiries' => Inquiry::latest()->limit(6)->get(['id', 'name', 'email', 'subject', 'status', 'created_at']),
            'recent_applications' => JobApplication::latest()->limit(6)->get(['id', 'name', 'position', 'status', 'created_at']),
        ];
    }
}
