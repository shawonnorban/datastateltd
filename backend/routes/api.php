<?php

use App\Http\Controllers\Api\Admin as A;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/site', [PublicController::class, 'site']);
Route::get('/pages/{slug}', [PublicController::class, 'page'])->where('slug', '.*');
Route::get('/hosting', [PublicController::class, 'hosting']);
Route::get('/services', [PublicController::class, 'services']);
Route::get('/industries', [PublicController::class, 'industries']);
Route::get('/testimonials', [PublicController::class, 'testimonials']);
Route::post('/inquiries', [PublicController::class, 'storeInquiry'])->middleware('throttle:10,1');
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{slug}', [JobController::class, 'show']);
Route::post('/jobs/{slug}/apply', [JobController::class, 'apply'])->middleware('throttle:10,1');

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{type}/{slug}', [PostController::class, 'show']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [A\AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [A\AuthController::class, 'me']);
        Route::post('/logout', [A\AuthController::class, 'logout']);
        Route::get('/dashboard', A\DashboardController::class);

        Route::get('/settings', [A\SettingsController::class, 'show']);
        Route::post('/settings', [A\SettingsController::class, 'update']);

        Route::get('/sections', [A\SectionController::class, 'index']);
        Route::get('/sections/{section}', [A\SectionController::class, 'show']);
        Route::post('/sections/{section}', [A\SectionController::class, 'update']);

        Route::get('/pages', [A\PageController::class, 'index']);
        Route::put('/pages/{page}', [A\PageController::class, 'update']);

        Route::apiResource('plans', A\PlanController::class)->except('show');
        Route::apiResource('tlds', A\TldController::class)->except('show');

        Route::get('/memberships', [A\MembershipController::class, 'index']);
        Route::post('/memberships', [A\MembershipController::class, 'store']);
        Route::post('/memberships/{membership}', [A\MembershipController::class, 'update']);
        Route::delete('/memberships/{membership}', [A\MembershipController::class, 'destroy']);

        Route::apiResource('jobs', A\JobController::class);
        Route::get('/posts', [A\PostController::class, 'index']);
        Route::get('/posts/{post}', [A\PostController::class, 'show']);
        Route::post('/posts', [A\PostController::class, 'store']);
        Route::post('/posts/{post}', [A\PostController::class, 'update']);
        Route::delete('/posts/{post}', [A\PostController::class, 'destroy']);
        Route::apiResource('categories', A\PostCategoryController::class)->except('show');

        Route::get('/applications/export', [A\ApplicationController::class, 'export']);
        Route::delete('/applications/{application}', [A\ApplicationController::class, 'destroy']);
        Route::get('/applications', [A\ApplicationController::class, 'index']);
        Route::put('/applications/{application}', [A\ApplicationController::class, 'update']);
        Route::get('/applications/{application}/cv', [A\ApplicationController::class, 'cv']);

        Route::get('/inquiries', [A\InquiryController::class, 'index']);
        Route::put('/inquiries/{inquiry}', [A\InquiryController::class, 'update']);
    });
});
