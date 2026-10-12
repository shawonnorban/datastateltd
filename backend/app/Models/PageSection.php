<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'page', 'key', 'type', 'eyebrow', 'title', 'subtitle',
        'data', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['data' => 'array', 'is_active' => 'boolean'];
    }
}
