@extends('admin.layout')
@section('title', 'Dashboard')

@section('content')
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-1">Dashboard</h1>
                    <p class="text-secondary mb-0">Website overview and recent inquiries</p>
                </div>
                <span class="badge text-bg-primary">Admin Panel</span>
            </div>

            <div class="row g-3 mb-4">
                @foreach ([
                    ['Services', $servicesCount],
                    ['Projects', $projectsCount],
                    ['Blog Posts', $postsCount],
                    ['New Inquiries', $newInquiriesCount],
                ] as [$label, $count])
                    <div class="col-sm-6 col-xl-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="text-secondary small">{{ $label }}</div>
                                <div class="display-6 fw-semibold">{{ $count }}</div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3">
                    <h2 class="h5 mb-0">Recent Inquiries</h2>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                        <tr>
                            <th>Name</th><th>Email</th><th>Type</th><th>Status</th><th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse ($recentInquiries as $inquiry)
                            <tr>
                                <td>{{ $inquiry->name }}</td>
                                <td>{{ $inquiry->email }}</td>
                                <td>{{ ucfirst($inquiry->type) }}</td>
                                <td><span class="badge text-bg-secondary">{{ $inquiry->status }}</span></td>
                                <td>{{ $inquiry->created_at?->format('d M Y') }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="5" class="text-center text-secondary py-4">No inquiries yet.</td></tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        @endsection
