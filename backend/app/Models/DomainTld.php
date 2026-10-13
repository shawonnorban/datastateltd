<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DomainTld extends Model
{
    protected $fillable = ['extension', 'price', 'old_price', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['price' => 'float', 'old_price' => 'float', 'is_active' => 'boolean'];
    }
}
