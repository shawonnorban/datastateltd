@extends('admin.layout')
@section('title', 'Site Settings')

@php
    $rows = array_pad($branches, count($branches) + 2, ['name' => '', 'address' => '', 'phone' => '', 'email' => '']);
    $field = fn ($key, $label, $type = 'text') => compact('key', 'label', 'type');
@endphp

@section('content')
    <h1 class="h3 mb-1">Site Settings</h1>
    <p class="text-secondary">Logo, contact details and branches shown on the public website.</p>

    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif
    @if ($errors->any())
        <div class="alert alert-danger">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.settings.update') }}" enctype="multipart/form-data">
        @csrf

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white"><h2 class="h6 mb-0">Branding</h2></div>
            <div class="card-body row g-3">
                <div class="col-md-6">
                    <label class="form-label">Site name</label>
                    <input name="site_name" class="form-control" value="{{ old('site_name', $s['site_name'] ?? '') }}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Tagline</label>
                    <input name="tagline" class="form-control" value="{{ old('tagline', $s['tagline'] ?? '') }}">
                </div>
                <div class="col-12">
                    <label class="form-label">Logo (PNG, JPG, WebP or SVG, max 2 MB)</label>
                    @if ($logoUrl)
                        <div class="mb-2 p-3 bg-body-tertiary rounded d-inline-block"><img src="{{ $logoUrl }}" alt="Logo" style="max-height:60px"></div>
                    @endif
                    <input type="file" name="logo" class="form-control" accept="image/*">
                </div>
                <div class="col-12">
                    <label class="form-label">Hero banner image (background of the top banner on every page; PNG, JPG or WebP, max 4 MB)</label>
                    @if ($bannerUrl)
                        <div class="mb-2"><img src="{{ $bannerUrl }}" alt="Banner" style="max-height:110px;border-radius:8px"></div>
                        <div class="form-check mb-2"><input class="form-check-input" type="checkbox" name="remove_hero_banner" value="1" id="rb"><label class="form-check-label" for="rb">Remove current banner</label></div>
                    @endif
                    <input type="file" name="hero_banner" class="form-control" accept="image/png,image/jpeg,image/webp">
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white"><h2 class="h6 mb-0">Contact</h2></div>
            <div class="card-body row g-3">
                @foreach ([
                    ['contact_phone', 'Phone'], ['contact_whatsapp', 'WhatsApp number'],
                    ['contact_email', 'Email'], ['map_embed_url', 'Google Maps embed URL'],
                ] as [$key, $label])
                    <div class="col-md-6">
                        <label class="form-label">{{ $label }}</label>
                        <input name="{{ $key }}" class="form-control" value="{{ old($key, $s[$key] ?? '') }}">
                    </div>
                @endforeach
                <div class="col-12">
                    <label class="form-label">Address</label>
                    <textarea name="address" rows="2" class="form-control">{{ old('address', $s['address'] ?? '') }}</textarea>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white"><h2 class="h6 mb-0">Social links</h2></div>
            <div class="card-body row g-3">
                @foreach (['facebook_url' => 'Facebook', 'twitter_url' => 'Twitter / X', 'linkedin_url' => 'LinkedIn', 'youtube_url' => 'YouTube'] as $key => $label)
                    <div class="col-md-6">
                        <label class="form-label">{{ $label }}</label>
                        <input name="{{ $key }}" class="form-control" placeholder="https://" value="{{ old($key, $s[$key] ?? '') }}">
                    </div>
                @endforeach
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white"><h2 class="h6 mb-0">Legal &amp; memberships (footer)</h2></div>
            <div class="card-body row g-3">
                <div class="col-md-6">
                    <label class="form-label">Legal info (one line each)</label>
                    <textarea name="legal_info" rows="4" class="form-control">{{ old('legal_info', $s['legal_info'] ?? '') }}</textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Memberships (one per line: SHORT|Full name)</label>
                    <textarea name="memberships" rows="4" class="form-control">{{ old('memberships', $s['memberships'] ?? '') }}</textarea>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white"><h2 class="h6 mb-0">Branches</h2></div>
            <div class="card-body">
                <p class="text-secondary small">Leave the name blank to remove a branch. Two empty rows are provided for new branches.</p>
                @foreach ($rows as $i => $b)
                    <div class="row g-2 mb-3 pb-3 border-bottom">
                        <div class="col-md-3"><input name="branches[{{ $i }}][name]" class="form-control" placeholder="Name" value="{{ $b['name'] }}"></div>
                        <div class="col-md-4"><input name="branches[{{ $i }}][address]" class="form-control" placeholder="Address" value="{{ $b['address'] }}"></div>
                        <div class="col-md-2"><input name="branches[{{ $i }}][phone]" class="form-control" placeholder="Phone" value="{{ $b['phone'] }}"></div>
                        <div class="col-md-3"><input name="branches[{{ $i }}][email]" class="form-control" placeholder="Email" value="{{ $b['email'] }}"></div>
                    </div>
                @endforeach
            </div>
        </div>

        <button class="btn btn-primary">Save settings</button>
    </form>
@endsection
