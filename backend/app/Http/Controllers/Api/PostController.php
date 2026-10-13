<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    private function card(Post $p): array
    {
        return [
            'slug' => $p->slug,
            'type' => $p->type,
            'title' => $p->title,
            'excerpt' => $p->excerpt,
            'category' => $p->category?->name,
            'category_slug' => $p->category?->slug,
            'image_url' => $p->featured_image ? Storage::disk('public')->url($p->featured_image) : null,
            'published_at' => $p->published_at?->toDateString(),
            'read_minutes' => $p->read_minutes ?: max(1, (int) ceil(str_word_count(strip_tags((string) $p->content)) / 200)),
        ];
    }

    private function published(string $type)
    {
        return Post::with('category')->where('type', $type)->where('status', 'published')
            ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()));
    }

    public function index(Request $request)
    {
        $type = $request->query('type') === 'news' ? 'news' : 'blog';
        $q = $this->published($type);

        if ($s = trim((string) $request->query('q'))) {
            $q->where(fn ($w) => $w->where('title', 'like', "%{$s}%")->orWhere('excerpt', 'like', "%{$s}%")->orWhere('content', 'like', "%{$s}%"));
        }
        if ($c = $request->query('category')) {
            $q->whereHas('category', fn ($w) => $w->where('slug', $c));
        }

        $page = $q->orderByDesc('published_at')->orderByDesc('id')->paginate(9)->withQueryString();

        return [
            'data' => collect($page->items())->map(fn ($p) => $this->card($p)),
            'meta' => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'total' => $page->total()],
            'categories' => PostCategory::where('is_active', true)
                ->whereHas('posts', fn ($w) => $w->where('type', $type)->where('status', 'published'))
                ->orderBy('name')->get(['name', 'slug']),
        ];
    }

    public function show(string $type, string $slug)
    {
        $type = $type === 'news' ? 'news' : 'blog';
        $post = $this->published($type)->where('slug', $slug)->firstOrFail();
        $post->increment('views_count');

        $related = $this->published($type)->where('id', '!=', $post->id)
            ->when($post->post_category_id, fn ($q) => $q->orderByRaw('post_category_id = ? desc', [$post->post_category_id]))
            ->orderByDesc('published_at')->limit(3)->get();

        return $this->card($post) + [
            'content' => $post->content,
            'meta_title' => $post->meta_title ?: $post->title,
            'meta_description' => $post->meta_description ?: $post->excerpt,
            'views' => $post->views_count,
            'related' => $related->map(fn ($p) => $this->card($p)),
        ];
    }
}
