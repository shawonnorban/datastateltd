<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    private function rules(?Post $post = null): array
    {
        return [
            'type' => ['required', 'in:blog,news'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('posts', 'slug')->ignore($post?->id)],
            'post_category_id' => ['nullable', 'integer', 'exists:post_categories,id'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string', 'max:200000'],
            'status' => ['required', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'read_minutes' => ['nullable', 'integer', 'min:1', 'max:120'],
            'image' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
        ];
    }

    private function uniqueSlug(string $base, ?int $ignore = null): string
    {
        $slug = Str::slug($base) ?: 'post';
        $candidate = $slug;
        $n = 2;
        while (Post::where('slug', $candidate)->when($ignore, fn ($q) => $q->where('id', '!=', $ignore))->exists()) {
            $candidate = $slug.'-'.$n++;
        }

        return $candidate;
    }

    private function present(Post $p): array
    {
        return $p->only(['id', 'type', 'title', 'slug', 'post_category_id', 'excerpt', 'content', 'status', 'meta_title', 'meta_description', 'read_minutes', 'views_count'])
            + [
                'published_at' => $p->published_at?->format('Y-m-d\TH:i'),
                'image_url' => $p->featured_image ? Storage::disk('public')->url($p->featured_image) : null,
                'category' => $p->category?->name,
                'updated_at' => $p->updated_at,
            ];
    }

    public function index(Request $request)
    {
        return Post::with('category')->when($request->query('type'), fn ($q, $t) => $q->where('type', $t))
            ->orderByDesc('published_at')->orderByDesc('id')->get()
            ->map(fn ($p) => $this->present($p));
    }

    public function show(Post $post)
    {
        return $this->present($post->load('category'));
    }

    private function fill(Request $request, ?Post $post = null): Post
    {
        $data = $request->validate($this->rules($post));
        $image = $post?->featured_image;

        if (($request->boolean('remove_image') || $request->hasFile('image')) && $image) {
            Storage::disk('public')->delete($image);
            $image = null;
        }
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('posts', 'public');
        }

        $attrs = collect($data)->except(['image', 'remove_image', 'slug'])->all();
        $attrs['slug'] = ($data['slug'] ?? null) ?: ($post?->slug ?: $this->uniqueSlug($data['title']));
        $attrs['featured_image'] = $image;
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $attrs['published_at'] = $post?->published_at ?? now();
        }
        $attrs['user_id'] = $post?->user_id ?? $request->user()->id;

        if ($post) {
            $post->update($attrs);

            return $post->fresh('category');
        }

        return Post::create($attrs)->load('category');
    }

    /** Create and update both use POST so multipart uploads work. */
    public function store(Request $request)
    {
        return response($this->present($this->fill($request)), 201);
    }

    public function update(Request $request, Post $post)
    {
        return $this->present($this->fill($request, $post));
    }

    public function destroy(Post $post)
    {
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }
        $post->delete();

        return response()->noContent();
    }
}
