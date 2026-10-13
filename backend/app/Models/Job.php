<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    protected $table = 'jobs_board';

    protected $fillable = [
        'title', 'slug', 'subtitle', 'company', 'location', 'employment_type', 'experience_level',
        'salary', 'vacancies', 'deadline', 'summary', 'sections', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['sections' => 'array', 'is_active' => 'boolean', 'deadline' => 'date'];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_id');
    }

    public function isOpen(): bool
    {
        return $this->is_active && (! $this->deadline || $this->deadline->endOfDay()->isFuture());
    }
}
