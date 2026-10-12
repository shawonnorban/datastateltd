<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect('/login'));

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:10,1')->name('login.store');
});
Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::get('/sections', [SectionController::class, 'index'])->name('sections.index');
        Route::get('/sections/{section}', [SectionController::class, 'edit'])->name('sections.edit');
        Route::put('/sections/{section}', [SectionController::class, 'update'])->name('sections.update');
        Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
    });
