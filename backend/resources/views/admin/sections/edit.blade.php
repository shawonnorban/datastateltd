@extends('admin.layout')
@section('title', 'Edit Section')

@section('content')
    <a href="{{ route('admin.sections.index') }}" class="small">&larr; All sections</a>
    <h1 class="h3 mt-2 mb-1">{{ $section->key }}</h1>
    <p class="text-secondary">Page: <b>{{ $section->page }}</b> &middot; Type: <b>{{ $section->type }}</b></p>

    @if (session('status'))<div class="alert alert-success">{{ session('status') }}</div>@endif
    @if ($errors->any())<div class="alert alert-danger">{{ $errors->first() }}</div>@endif

    <form method="POST" action="{{ route('admin.sections.update', $section) }}" class="card border-0 shadow-sm">
        @csrf @method('PUT')
        <div class="card-body row g-3">
            <div class="col-md-6">
                <label class="form-label">Eyebrow (small label)</label>
                <input name="eyebrow" class="form-control" value="{{ old('eyebrow', $section->eyebrow) }}">
            </div>
            <div class="col-md-3">
                <label class="form-label">Sort order</label>
                <input type="number" name="sort_order" min="0" class="form-control" value="{{ old('sort_order', $section->sort_order) }}">
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="active" name="is_active" value="1" @checked(old('is_active', $section->is_active))>
                    <label class="form-check-label" for="active">Visible on site</label>
                </div>
            </div>
            <div class="col-12">
                <label class="form-label">Title</label>
                <input name="title" class="form-control" value="{{ old('title', $section->title) }}">
            </div>
            <div class="col-12">
                <label class="form-label">Subtitle</label>
                <textarea name="subtitle" rows="2" class="form-control">{{ old('subtitle', $section->subtitle) }}</textarea>
            </div>
            <div class="col-12">
                <label class="form-label">Content (JSON: items, buttons, bullets, etc.)</label>
                <textarea name="data" rows="16" class="form-control font-monospace small">{{ old('data', json_encode($section->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) }}</textarea>
            </div>
        </div>
        <div class="card-footer bg-white"><button class="btn btn-primary">Save section</button></div>
    </form>
@endsection
