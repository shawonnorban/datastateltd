<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Admin') | Smart Global IT</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container-fluid">
    <div class="row min-vh-100">
        <aside class="col-lg-2 bg-dark text-white p-4">
            <h5 class="mb-1">SMART GLOBAL IT</h5>
            <small class="text-secondary">Administration</small>
            <hr>
            <a href="{{ route('admin.dashboard') }}" class="d-block text-decoration-none mb-3 {{ request()->routeIs('admin.dashboard') ? 'text-white' : 'text-white-50' }}">Dashboard</a>
            <a href="{{ route('admin.settings.edit') }}" class="d-block text-decoration-none mb-3 {{ request()->routeIs('admin.settings.*') ? 'text-white' : 'text-white-50' }}">Site Settings</a>
            <form method="POST" action="{{ route('logout') }}" class="mt-5">
                @csrf
                <button type="submit" class="btn btn-outline-light btn-sm w-100">Logout</button>
            </form>
        </aside>
        <main class="col-lg-10 p-4 p-lg-5">
            @yield('content')
        </main>
    </div>
</div>
@stack('scripts')
</body>
</html>
