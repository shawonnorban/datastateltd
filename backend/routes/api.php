<?php

use App\Http\Controllers\Api\Admin as A;
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
Route::post('/job-applications', [PublicController::class, 'storeApplication'])->middleware('throttle:6,1');

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

        Route::get('/applications', [A\ApplicationController::class, 'index']);
        Route::put('/applications/{application}', [A\ApplicationController::class, 'update']);
        Route::get('/applications/{application}/cv', [A\ApplicationController::class, 'cv']);

        Route::get('/inquiries', [A\InquiryController::class, 'index']);
        Route::put('/inquiries/{inquiry}', [A\InquiryController::class, 'update']);
    });
});
