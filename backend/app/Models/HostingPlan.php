<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HostingPlan extends Model
{
    protected $fillable = [
        'name', 'tagline', 'badge', 'discount_label', 'old_price_yearly',
        'price_monthly', 'price_yearly', 'price_triennial', 'features', 'specs',
        'order_url', 'is_popular', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'specs' => 'array',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'old_price_yearly' => 'float',
            'price_monthly' => 'float',
            'price_yearly' => 'float',
            'price_triennial' => 'float',
        ];
    }
}
