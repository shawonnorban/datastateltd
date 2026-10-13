<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MembershipController extends Controller
{
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'full_name' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:500'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
        ];
    }

    public function index()
    {
        return Membership::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $m = Membership::create([
            'name' => $data['name'],
            'full_name' => $data['full_name'] ?? null,
            'url' => $data['url'] ?? null,
            'is_active' => $data['is_active'],
            'sort_order' => $data['sort_order'],
            'image' => $request->hasFile('image') ? $request->file('image')->store('memberships', 'public') : null,
        ]);

        return response($m, 201);
    }

    /** POST (not PUT) so multipart image uploads work. */
    public function update(Request $request, Membership $membership)
    {
        $data = $request->validate($this->rules());
        $image = $membership->image;

        if (($request->boolean('remove_image') || $request->hasFile('image')) && $image) {
            Storage::disk('public')->delete($image);
            $image = null;
        }
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('memberships', 'public');
        }

        $membership->update([
            'name' => $data['name'],
            'full_name' => $data['full_name'] ?? null,
            'url' => $data['url'] ?? null,
            'is_active' => $data['is_active'],
            'sort_order' => $data['sort_order'],
            'image' => $image,
        ]);

        return $membership->fresh();
    }

    public function destroy(Membership $membership)
    {
        if ($membership->image) {
            Storage::disk('public')->delete($membership->image);
        }
        $membership->delete();

        return response()->noContent();
    }
}
