<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'client_name', 'client_position', 'company_name', 'client_photo',
        'rating', 'content', 'is_featured', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['rating' => 'integer', 'is_featured' => 'boolean', 'is_active' => 'boolean'];
    }
}
