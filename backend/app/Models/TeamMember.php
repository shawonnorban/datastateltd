<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name', 'slug', 'designation', 'bio', 'photo',
        'email', 'social_links', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['social_links' => 'array', 'is_active' => 'boolean'];
    }
}
