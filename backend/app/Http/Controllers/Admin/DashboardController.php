<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'servicesCount' => Service::count(),
            'projectsCount' => Project::count(),
            'postsCount' => Post::count(),
            'newInquiriesCount' => Inquiry::where('status', 'new')->count(),
            'recentInquiries' => Inquiry::latest()->limit(8)->get(),
        ]);
    }
}
