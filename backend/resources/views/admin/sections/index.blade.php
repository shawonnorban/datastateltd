@extends('admin.layout')
@section('title', 'Page Sections')

@section('content')
    <h1 class="h3 mb-1">Page Sections</h1>
    <p class="text-secondary">Edit the content blocks shown on each public page.</p>

    @foreach ($pages as $page => $sections)
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white"><h2 class="h6 mb-0 text-capitalize">{{ $page }} page</h2></div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light"><tr><th>#</th><th>Type</th><th>Title</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                    @foreach ($sections as $s)
                        <tr>
                            <td>{{ $s->sort_order }}</td>
                            <td><span class="badge text-bg-light">{{ $s->type }}</span></td>
                            <td>{{ \Illuminate\Support\Str::limit($s->title ?: $s->key, 70) }}</td>
                            <td>{!! $s->is_active ? '<span class="badge text-bg-success">Active</span>' : '<span class="badge text-bg-secondary">Hidden</span>' !!}</td>
                            <td class="text-end"><a href="{{ route('admin.sections.edit', $s) }}" class="btn btn-sm btn-outline-primary">Edit</a></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    @endforeach
@endsection
