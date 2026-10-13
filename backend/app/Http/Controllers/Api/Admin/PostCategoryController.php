<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PostCategoryController extends Controller
{
    private function rules(?PostCategory $c = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120', Rule::unique('post_categories', 'name')->ignore($c?->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function index()
    {
        return PostCategory::withCount('posts')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $data['slug'] = $this->slug($data['name']);

        return response(PostCategory::create($data), 201);
    }

    public function update(Request $request, PostCategory $category)
    {
        $category->update($request->validate($this->rules($category)));

        return $category;
    }

    public function destroy(PostCategory $category)
    {
        $category->delete();   // posts keep existing, category becomes null

        return response()->noContent();
    }

    private function slug(string $name): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $n = 2;
        while (PostCategory::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$n++;
        }

        return $slug;
    }
}
