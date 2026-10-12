<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'position', 'name', 'email', 'phone', 'cover_note',
        'cv_path', 'cv_original_name', 'status',
    ];
}
