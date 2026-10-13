<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Membership extends Model
{
    protected $fillable = ['name', 'full_name', 'image', 'url', 'is_active', 'sort_order'];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::disk('public')->url($this->image) : null;
    }
}
