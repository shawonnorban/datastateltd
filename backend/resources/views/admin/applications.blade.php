@extends('admin.layout')
@section('title', 'Job Applications')

@section('content')
    <h1 class="h3 mb-1">Job Applications</h1>
    <p class="text-secondary">Applications submitted from the Careers page.</p>
    @if (session('status'))<div class="alert alert-success">{{ session('status') }}</div>@endif

    <div class="card border-0 shadow-sm">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light"><tr><th>Applicant</th><th>Position</th><th>Contact</th><th>CV</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                @forelse ($applications as $a)
                    <tr>
                        <td>{{ $a->name }}@if ($a->cover_note)<div class="small text-secondary">{{ \Illuminate\Support\Str::limit($a->cover_note, 80) }}</div>@endif</td>
                        <td class="small">{{ $a->position }}</td>
                        <td class="small">{{ $a->email }}<br>{{ $a->phone }}</td>
                        <td><a class="btn btn-sm btn-outline-primary" href="{{ route('admin.applications.cv', $a) }}">Download</a></td>
                        <td>
                            <form method="POST" action="{{ route('admin.applications.update', $a) }}" class="d-flex gap-1">
                                @csrf @method('PUT')
                                <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                                    @foreach (['new', 'reviewed', 'shortlisted', 'rejected'] as $s)
                                        <option value="{{ $s }}" @selected($a->status === $s)>{{ ucfirst($s) }}</option>
                                    @endforeach
                                </select>
                            </form>
                        </td>
                        <td class="small">{{ $a->created_at?->format('d M Y') }}</td>
                    </tr>
                @empty
                    <tr><td colspan="6" class="text-center text-secondary py-4">No applications yet.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <div class="mt-3">{{ $applications->links() }}</div>
@endsection
