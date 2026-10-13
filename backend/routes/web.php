<?php

use Illuminate\Support\Facades\Route;

// The admin panel is a single-page app built into public/admin-app (source: /admin in the repo).
Route::get('/', fn () => redirect('/admin'));

Route::get('/admin/{path?}', function () {
    $index = public_path('admin-app/index.html');

    abort_unless(is_file($index), 404, 'Admin panel is not built yet. Run "npm run build" in the admin folder.');

    return response()->file($index);
})->where('path', '(?!assets/).*');
