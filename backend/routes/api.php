<?php

use App\Http\Controllers\Api\PublicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/site', [PublicController::class, 'site']);
Route::get('/pages/{slug}', [PublicController::class, 'page'])->where('slug', '.*');
Route::get('/services', [PublicController::class, 'services']);
Route::get('/industries', [PublicController::class, 'industries']);
Route::get('/testimonials', [PublicController::class, 'testimonials']);
Route::post('/inquiries', [PublicController::class, 'storeInquiry'])->middleware('throttle:10,1');
Route::post('/job-applications', [PublicController::class, 'storeApplication'])->middleware('throttle:6,1');
